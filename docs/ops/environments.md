# Окружения и конфигурация

## Принципы
- 12-factor: конфигурация через переменные окружения
- Секреты вне VCS

## Переменные
- Пример — `.env.example` или `ENV_EXAMPLE.txt`
- Разделяйте: dev / stage / prod
- Frontend: `NEXT_PUBLIC_API_BASE_URL` — базовый URL сервера (например, http://localhost:3001)
- Server: `CORS_ORIGIN` — разрешённый origin фронта (например, http://localhost:3000)

## Хранение секретов
- Secret Manager/CI Secrets
- Локально — только заглушки
