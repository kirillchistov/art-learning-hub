# Art Learning Hub

Сборник материалов по истории искусства: уроки, лекции, вебинары, ДЗ,  тесты. Оптимизирован для мобильных устройств и планшетов.

## Рекомендуемый стек

| Слой | Технология | Почему |
|------|-----------|--------|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) | Нативная интеграция с Vercel, SSG/SSR, Edge Middleware для авторизации |
| **Язык** | TypeScript | Типизация контента и API |
| **Контент** | JSON в `content/courses/` | Простое добавление разделов без правки UI; можно позже перейти на MDX |
| **Стили** | CSS custom properties (без фреймворка) | Сохранён дизайн оригинала, минимальный bundle, mobile-first |
| **Авторизация** | JWT cookie (`jose`) + Vercel Middleware | Без внешних провайдеров (Auth.js, Clerk); логины/пароли в env |
| **Деплой** | Vercel | Автодеплой из GitHub, HTTPS, CDN |
| **CI/CD** | GitHub → Vercel | Push в `main` = production deploy |

### Альтернативы (не выбраны)

- **Astro** — отлично для статики, но middleware/auth проще в Next.js на Vercel
- **Vite + React SPA** — нет серверного middleware для защиты маршрутов
- **Tailwind** — можно добавить позже; сейчас CSS-переменные покрывают потребности

## Структура проекта

```
├── app/                    # Next.js App Router
│   ├── page.tsx            # Каталог разделов
│   ├── login/              # Страница входа
│   ├── course/[slug]/      # Страница курса
│   └── api/auth/           # Login / logout API
├── components/             # UI-компоненты
├── content/courses/        # Данные курсов (JSON)
│   ├── modern-art.json     # Современное искусство (12 уроков)
│   ├── izi.json            # История зарубежного искусства
│   └── …                   # Заглушки будущих разделов
├── lib/                    # auth, content loader, types
├── middleware.ts           # Защита всех маршрутов
├── docs/CONTENT.md         # Инструкция: ссылки, уроки, Drive
├── materials/              # Локальные копии PDF (не в git)
├── legacy/index.html       # Оригинальная версия
└── scripts/extract-lessons.mjs  # Парсер уроков из HTML
```

> **Материалы (PDF, презентации)** хранятся на Google Drive. В git — только JSON со ссылками. Локальные папки `СИ_урок_*` и `materials/` игнорируются. Подробнее: [docs/CONTENT.md](docs/CONTENT.md).

## Разделы

| Slug | Название | Статус |
|------|----------|--------|
| `modern-art` | Современное искусство | ✅ active |
| `izi` | История зарубежного искусства | ✅ active (заготовка) |
| `russian-art` | История русского искусства | 🔜 coming-soon |
| `eastern-art` | Искусство Востока | 🔜 coming-soon |
| `gothic-architecture` | Готическая архитектура | 🔜 coming-soon |
| `renaissance-architecture` | Архитектура Возрождения | 🔜 coming-soon |
| `soviet-architecture` | Советская архитектура | 🔜 coming-soon |
| `ancient-russian-architecture` | Древнерусская архитектура | 🔜 coming-soon |
| `expert-view` | Искусство глазами эксперта | 🔜 coming-soon |

### Добавление нового раздела

1. Создайте `content/courses/my-course.json` по образцу `modern-art.json`
2. Импортируйте его в `lib/content.ts`
3. Установите `"status": "active"` когда материалы готовы

## Авторизация

Простая схема без облачных провайдеров:

- Логины и пароли задаются в переменной `AUTH_USERS` (формат: `login:password,login2:password2`)
- После входа выдаётся httpOnly JWT-cookie на 14 дней
- Middleware перенаправляет неавторизованных на `/login`

### Переменные окружения

Скопируйте `.env.example` → `.env.local` (локально) и добавьте в Vercel Dashboard → Settings → Environment Variables:

```
AUTH_SECRET=<случайная строка ≥32 символов>
AUTH_USERS=student1:pass1,student2:pass2,student3:pass3
```

> **Безопасность:** для 3–5 пользователей этого достаточно. Пароли хранятся только в env Vercel, не в коде. При необходимости позже можно заменить plain-text пароли на bcrypt-хеши.

## Локальная разработка

```bash
npm install
cp .env.example .env.local
# отредактируйте AUTH_SECRET и AUTH_USERS
npm run dev
```

Откройте http://localhost:3000

## CI/CD: GitHub → Vercel

Текущий деплой через прокси заменяется прямой интеграцией GitHub + Vercel.

### Шаг 1. Создать GitHub-репозиторий

На [github.com/new](https://github.com/new) создайте **private** репозиторий `art-learning-hub` (без README/license — они уже есть локально).

```bash
git remote add origin https://github.com/kirillchistov/art-learning-hub.git
git branch -M main
git push -u origin main
```

> Не добавляйте в git PDF и другие большие файлы — только код и JSON. Лимит GitHub: 100 МБ на файл.

### Шаг 2. Подключить Vercel к GitHub

1. Откройте [Vercel Dashboard](https://vercel.com/points-5fedac28/art-learning-hub)
2. **Settings → Git** → Connect Git Repository
3. Выберите созданный репозиторий `art-learning-hub`
4. Framework Preset: **Next.js** (определится автоматически)
5. Root Directory: `./`
6. Build Command: `next build` (по умолчанию)
7. Output Directory: `.next` (по умолчанию)

### Шаг 3. Environment Variables в Vercel

В **Settings → Environment Variables** добавьте:

- `AUTH_SECRET` — для Production, Preview, Development
- `AUTH_USERS` — для Production, Preview, Development

### Шаг 4. Домен

- **Settings → Domains** — привяжите существующий домен или используйте `*.vercel.app`
- После подключения GitHub каждый push в `main` автоматически деплоит production

### Шаг 5. Отключить прокси-деплой

После успешного деплоя из GitHub удалите старую прокси-конфигурацию, чтобы трафик шёл напрямую на Vercel.

## Обновление контента

### Перегенерация из legacy HTML

```bash
npm run extract-content
```

### Ручное редактирование

Редактируйте JSON-файлы в `content/courses/`. Как добавлять и заменять ссылки на Google Drive — см. [docs/CONTENT.md](docs/CONTENT.md).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Локальный dev-сервер |
| `npm run build` | Production-сборка |
| `npm run start` | Запуск production |
| `npm run extract-content` | Извлечь уроки из `legacy/index.html` |
