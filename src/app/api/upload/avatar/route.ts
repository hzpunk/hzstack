import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    // Проверка авторизации
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload?.userId) {
      return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 })
    }

    // Получение файла
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 })
    }

    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' 
      }, { status: 400 })
    }

    // Проверка размера файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        ok: false, 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 })
    }

    // Создание директории для аватаров, если не существует
    const uploadsDir = join(process.cwd(), 'public', 'avatars')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Директория уже существует
    }

    // Генерация уникального имени файла
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${payload.userId}_${timestamp}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Сохранение файла
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Обновление профиля пользователя с путем к аватару
    const avatarUrl = `/avatars/${fileName}`
    await prisma.profile.update({
      where: { userId: payload.userId },
      data: { avatar: avatarUrl }
    })

    console.log(`[SECURITY] Avatar uploaded for user ${payload.userId}: ${avatarUrl}`)

    return NextResponse.json({ 
      ok: true, 
      avatarUrl 
    })

  } catch (error) {
    console.error('[SECURITY] Avatar upload error:', error)
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to upload avatar' 
    }, { status: 500 })
  }
}
