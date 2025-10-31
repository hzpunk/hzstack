// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
import { createRemoteJWKSet, jwtVerify, SignJWT } from 'https://esm.sh/jose@5.9.3'

type JsonResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

type ErrorResponse = {
  error: string
}

function json<T>(data: T, init?: number | ResponseInit) {
  const status = typeof init === 'number' ? init : init?.status ?? 200
  const headers = new Headers(typeof init === 'object' ? init.headers : undefined)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(data), { ...(typeof init === 'object' ? init : {}), status, headers })
}

function getEnv(name: string): string {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

async function verifyHzidToken(hzidToken: string) {
  const jwksUrl = new URL(getEnv('HZID_JWKS_URL'))
  const issuer = getEnv('HZID_ISSUER')
  const audience = getEnv('HZID_AUDIENCE')

  const JWKS = createRemoteJWKSet(jwksUrl)
  const { payload } = await jwtVerify(hzidToken, JWKS, { issuer, audience })
  if (!payload.sub) throw new Error('HZid token payload missing sub')
  return payload
}

async function signProjectJwt(hzidSub: string) {
  const projectJwtSecret = new TextEncoder().encode(getEnv('PROJECT_JWT_SECRET'))
  const expiresInSeconds = Number(Deno.env.get('PROJECT_JWT_EXPIRES_IN') ?? 3600)

  const now = Math.floor(Date.now() / 1000)
  const token = await new SignJWT({ hzid_sub: hzidSub })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + expiresInSeconds)
    .setIssuer(Deno.env.get('PROJECT_JWT_ISSUER') ?? 'hz-project')
    .setAudience(Deno.env.get('PROJECT_JWT_AUDIENCE') ?? 'hz-project')
    .sign(projectJwtSecret)

  return { token, expiresInSeconds }
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return json<ErrorResponse>({ error: 'Method Not Allowed' }, 405)
  }

  let hzidToken: string | undefined
  try {
    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as any
      hzidToken = body?.hzid_token
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData()
      hzidToken = form.get('hzid_token')?.toString()
    } else {
      const text = await req.text()
      try {
        const body = JSON.parse(text)
        hzidToken = (body as any)?.hzid_token
      } catch {
        // ignore
      }
    }
  } catch (e) {
    return json<ErrorResponse>({ error: 'Invalid request body' }, 400)
  }

  if (!hzidToken) {
    return json<ErrorResponse>({ error: 'Missing hzid_token' }, 400)
  }

  try {
    const payload = await verifyHzidToken(hzidToken)
    const { token, expiresInSeconds } = await signProjectJwt(String(payload.sub))

    return json<JsonResponse>({ access_token: token, token_type: 'bearer', expires_in: expiresInSeconds })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return json<ErrorResponse>({ error: message }, 401)
  }
}

// Supabase Edge Functions automatically use the default export as the handler.

