# Yandex Chat API Server

## Установка зависимостей

```bash
npm install
```

## Настройка переменных окружения

Создайте файл `.env` в папке `server/` со следующими переменными:

```env
YANDEX_API_KEY=ваш_api_ключ
YANDEX_FOLDER_ID=ваш_folder_id
PORT=3001
```

## Запуск

### Режим разработки (с авто-перезагрузкой)
```bash
npm run dev
```

### Продакшен режим
```bash
npm start
```

Сервер будет доступен на `http://localhost:3001`

## API Endpoint

**POST /api/chat**

Тело запроса:
```json
{
  "messages": [
    {
      "role": "user",
      "text": "Привет, помоги подобрать тур"
    }
  ]
}
```

Ответ содержит данные от Yandex GPT.
