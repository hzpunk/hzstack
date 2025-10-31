

## HZstack — шаблон стека

- **Next.js (App Router, React 18)**
- **TypeScript**
- **SCSS Modules + BEM** (без Tailwind)
- **Zustand** (UI state)
- **TanStack Query** (server state)
- **Zod + React Hook Form** (валидация форм)
- **Framer Motion** (анимации)
- **Supabase** (Postgres, Auth, Realtime, Functions, Storage)
  - Edge Functions, Migrations CLI, **pgVector**
- **Gulp** (assets)
- **ESLint + Prettier + Stylelint**
- **Husky + lint-staged + Commitlint**
- **Docker / Vercel**
- **GitHub Actions (CI/CD)**
- **Cypress (E2E)**
- **Storybook**

## Структура проекта

```
hzstack/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React компоненты
│   ├── stores/           # Zustand stores
│   ├── services/         # API clients, Supabase
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Утилиты
│   └── types/            # TypeScript типы
├── styles/               # SASS файлы
├── assets/               # Исходные ассеты
├── public/               # Скомпилированные ассеты
└── supabase/             # Миграции, функции

```

## Быстрый старт
1. Клонируйте репозиторий
2. Скопируйте `.env.example` (или `ENV_EXAMPLE.txt`) → `.env` и заполните значения
3. Запуск (выберите свой стек):
   - Docker: `docker compose up -d`
   - Make: `make bootstrap && make up`
   - Node: `pnpm i && pnpm dev`

## Скрипты

- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка для production
- `npm start` - запуск production сервера
- `npm run lint` - проверка кода линтером
- `npm run test:e2e` - Cypress E2E
- `npm run storybook` - Storybook
- `npm run assets:build` / `npm run assets:watch` - сборка/наблюдение ассетов (Gulp)
- `npm run lint:styles` - Stylelint для SCSS
- `npm run format` / `npm run format:write` - Prettier (проверка/фиксы)

## Supabase

- Миграции: SQL в `supabase/migrations/*` (включая `pgvector`).
- Edge Function пример: `supabase/functions/hello`.
- Переменные `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Интеграция HZid (единый профиль)

Цель: пользователи логинятся в HZid, а проекты (со своей БД Postgres/Supabase) доверяют этому логину.

Что в шаблоне:
- Миграция `003_hzid_users.sql`: таблица `public.users` с полем `hzid_user_id` и RLS-политиками по claim `hzid_sub` в JWT.
- Edge Function `supabase/functions/hzid-exchange`: принимает токен HZid, проверяет его по JWKS (`HZID_JWKS_URL`), выдаёт проектный JWT, в который шьёт `hzid_sub`.
- Пример переменных окружения в `ENV_EXAMPLE.txt`.

Поток:
1) Клиент получает `hzid_token` (после логина в HZid).
2) Отправляет его POST-ом в `/functions/v1/hzid-exchange`.
3) Функция возвращает `access_token` (подписан `PROJECT_JWT_SECRET` проекта).
4) Этот JWT использовать для запросов к БД/АПИ проекта (через заголовок `Authorization: Bearer ...`).

Важно: Supabase JS клиент ожидает свои сессии (access+refresh), поэтому для чистого клиентского доступа нужен обмен на сессию. В базовом шаблоне показан безопасный путь — использовать выданный JWT в ваших server actions/route handlers или проксировать запросы через Edge Functions с проверкой `hzid_token`.
## Шрифты

Положите файлы `Cygre.woff2` и `Cygre_Book.woff2` в `public/fonts/`. Они подключены в `src/styles/fonts.scss` и применяются глобально в `global.scss`.

## Docker

Сборка и запуск в контейнере:

```bash
docker compose up --build -d
```

### Локальный запуск (фронт + сервер + БД)

```bash
docker compose -f docker-compose.full.yml up --build
```

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml` (lint, stylelint, prettier-check, assets build, Next build).

## Лицензия

Приватный проект.

## Серверный модуль

См. `server/README.md` для PostgreSQL/Express сервера (аутентификация, HZid, 2FA, SMTP, тесты). Быстрый старт сервера: `cd server && npm install && npm run setup && npm run dev`.

### API и окружение
- Frontend использует `NEXT_PUBLIC_API_BASE_URL` для обращения к серверу (пример: `http://localhost:3001`).
- Сервер использует `CORS_ORIGIN` для разрешённого origin фронта (пример: `http://localhost:3000`).

