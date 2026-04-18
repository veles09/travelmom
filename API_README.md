# API-роут для чата с Yandex AI Studio

## Обзор

В данном репозитории создан API-сервер на Express.js, который перенаправляет сообщения от frontend к Yandex AI Studio.

## Структура

```
/workspace
├── server.ts          # API сервер на Express.js
├── .env.example       # Пример файла с переменными окружения
├── .env              # Файл с переменными окружения (не коммитить в git!)
└── src/
    └── pages/
        └── ChatPage.tsx  # Frontend компонент чата
```

## Настройка

### 1. Установка зависимостей

Зависимости уже установлены:
- `express` - веб-фреймворк для Node.js
- `cors` - middleware для CORS
- `dotenv` - загрузка переменных окружения
- `tsx` - запуск TypeScript файлов

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и заполните своими данными:

```bash
cp .env.example .env
```

Отредактируйте `.env`:
```
YANDEX_API_KEY=ваш_api_ключ_yandex_cloud
YANDEX_FOLDER_ID=ваш_folder_id_yandex_cloud
PORT=3001
```

### Как получить API ключ и Folder ID:

1. Зайдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Создайте платежный аккаунт (если нет)
3. Создайте новый каталог или используйте существующий
4. Скопируйте ID каталога (Folder ID)
5. Создайте API-ключ в разделе "Сервисные аккаунты"

### 3. Запуск сервера

```bash
# Запуск API сервера
npm run dev:server

# Или напрямую через tsx
npx tsx server.ts
```

Сервер запустится на порту 3001 (или другом, указанном в `.env`).

### 4. Запуск frontend

В отдельном терминале:
```bash
npm run dev
```

## Логика работы

1. **Frontend** (ChatPage.tsx) отправляет POST запрос на `/api/chat` с сообщением пользователя
2. **API сервер** (server.ts) получает сообщение и:
   - Проверяет наличие API ключа Yandex
   - Если ключа нет - возвращает mock-ответ
   - Если ключ есть - делает запрос к Yandex AI Studio
   - Возвращает ответ AI и подборку туров
3. **Frontend** отображает ответ пользователю

## API Endpoint

### POST /api/chat

**Request:**
```json
{
  "message": "Посоветуй отель в Турции с детьми"
}
```

**Response:**
```json
{
  "response": "Отлично! Я подобрал для вас несколько вариантов...",
  "tours": [
    {
      "id": "...",
      "name": "Family Paradise Resort",
      "location": "Турция, побережье",
      "price": 102690,
      "currency": "₽",
      "image": "...",
      "rating": 4.7,
      "reviews": 287,
      "features": ["Детский клуб", "Аквапарк"],
      "description": "..."
    }
  ]
}
```

## Режимы работы

### 1. Без API ключа (Development)
Если `YANDEX_API_KEY` не настроен или имеет значение по умолчанию, сервер возвращает mock-ответы для тестирования.

### 2. С API ключом (Production)
Сервер делает реальный запрос к Yandex AI Studio и возвращает ответы от нейросети.

### 3. При ошибке API
Если запрос к Yandex API не удался, сервер автоматически переключается на mock-ответы с предупреждением.

## Интеграция с Yandex AI Studio

Используется модель YandexGPT через Foundation Models API:
- Endpoint: `https://llm.api.cloud.yandex.net/foundationModels/v1/completion`
- Модель: `yandexgpt/latest`
- Температура: 0.7
- Максимум токенов: 2000

## Безопасность

- API ключи хранятся в `.env` файле (не коммитить в git!)
- CORS настроен для разрешения запросов с frontend
- В production рекомендуется добавить rate limiting и аутентификацию
