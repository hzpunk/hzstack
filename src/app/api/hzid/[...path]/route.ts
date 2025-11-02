import { NextRequest, NextResponse } from 'next/server'

const HZID_API_URL = process.env.NEXT_PUBLIC_HZID_API_URL || 'https://hzid.vercel.app/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'DELETE')
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Normalize base URL: remove trailing slash
    let baseUrl = HZID_API_URL.replace(/\/+$/, '')
    
    // Ensure baseUrl ends with /api
    if (!baseUrl.endsWith('/api')) {
      baseUrl = `${baseUrl.replace(/\/api$/, '')}/api`
    }
    
    const path = pathSegments.join('/')
    if (!path) {
      return NextResponse.json(
        {
          success: false,
          error: 'requested path is invalid'
        },
        { status: 400 }
      )
    }
    
    // Ensure single slash between baseUrl and path
    const url = `${baseUrl}/${path.replace(/^\/+/, '')}`
    
    // Получаем query параметры из оригинального запроса
    const searchParams = request.nextUrl.searchParams.toString()
    const fullUrl = searchParams ? `${url}?${searchParams}` : url

    // Копируем Authorization заголовок если есть
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    
    console.log('[HZid Proxy]', { 
      method, 
      path, 
      url: fullUrl, 
      baseUrl,
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader ? `${authHeader.substring(0, 20)}...` : null
    })

    // Копируем заголовки
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Копируем cookies
    const cookies = request.headers.get('cookie')
    if (cookies) {
      headers['Cookie'] = cookies
    }

    // Получаем тело запроса для POST/PUT
    let body: string | undefined
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      try {
        body = await request.text()
      } catch {
        // Нет тела запроса
      }
    }

    // Делаем запрос к HZid API
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    })

    // Получаем данные
    const data = await response.text()
    let jsonData: any
    
    try {
      jsonData = JSON.parse(data)
    } catch (parseError) {
      // Если не JSON, логируем и возвращаем как есть
      console.error('[HZid Proxy] Failed to parse response as JSON', {
        status: response.status,
        url: fullUrl,
        dataPreview: data.substring(0, 200)
      })
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
        },
      })
    }

    // Логируем ошибки от HZid API
    if (!response.ok || (jsonData.success === false)) {
      console.error('[HZid Proxy] Error from HZid API', {
        status: response.status,
        url: fullUrl,
        error: jsonData.error || jsonData.message,
        jsonData
      })
    }

    // Для rate limit (429) передаем заголовки и улучшаем формат ответа
    const responseHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (response.status === 429) {
      // Копируем rate limit заголовки если есть
      const retryAfter = response.headers.get('Retry-After')
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
      const rateLimitReset = response.headers.get('X-RateLimit-Reset')
      
      if (retryAfter) responseHeaders['Retry-After'] = retryAfter
      if (rateLimitRemaining) responseHeaders['X-RateLimit-Remaining'] = rateLimitRemaining
      if (rateLimitReset) responseHeaders['X-RateLimit-Reset'] = rateLimitReset
      
      // Если есть resetTime в теле ответа, используем его для расчета времени ожидания
      if (jsonData.resetTime) {
        const resetTime = parseInt(jsonData.resetTime)
        const now = Date.now()
        const secondsUntilReset = Math.ceil((resetTime - now) / 1000)
        
        if (secondsUntilReset > 0) {
          responseHeaders['Retry-After'] = secondsUntilReset.toString()
          responseHeaders['X-RateLimit-Reset'] = Math.floor(resetTime / 1000).toString()
        }
        
        // Улучшаем сообщение об ошибке
        const minutesUntilReset = Math.ceil(secondsUntilReset / 60)
        jsonData.message = jsonData.message || 
          `Слишком много запросов. Попробуйте снова через ${minutesUntilReset} ${minutesUntilReset === 1 ? 'минуту' : minutesUntilReset < 5 ? 'минуты' : 'минут'}.`
      }
    }

    // Возвращаем JSON ответ с правильными заголовками
    return NextResponse.json(jsonData, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('HZid proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

