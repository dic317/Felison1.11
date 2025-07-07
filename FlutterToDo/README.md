# Felison FinTech - Деплой на Vercel

## Шаги для деплоя

### 1. Подготовка репозитория
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Настройка базы данных
Поскольку приложение использует PostgreSQL, вам нужно:

1. Создать базу данных на [Neon](https://neon.tech) или [Supabase](https://supabase.com)
2. Получить строку подключения (DATABASE_URL)

### 3. Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Добавьте переменные окружения:
   - `DATABASE_URL` - строка подключения к PostgreSQL
   - `NODE_ENV=production`

### 4. Настройка переменных окружения

В дашборде Vercel добавьте:
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### 5. Автоматический деплой

После настройки каждый push в main ветку будет автоматически деплоить приложение.

## Структура проекта

- `client/` - React фронтенд
- `server/` - Express.js бэкенд
- `api/` - Vercel serverless функции
- `shared/` - Общие типы и схемы
- `vercel.json` - Конфигурация Vercel

## Локальная разработка

```bash
npm install
npm run dev
```

## Технологии

- React 18 + TypeScript
- Express.js + Node.js
- PostgreSQL + Drizzle ORM
- Tailwind CSS + Radix UI
- Vercel для деплоя