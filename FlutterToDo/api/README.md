# Felison FinTech API

## Serverless Functions для Vercel

Эта папка содержит serverless функции для backend функционала приложения.

### Endpoints

#### `/api/transactions`
- **GET** - Получить все транзакции
- **POST** - Создать новую транзакцию
- **DELETE** - Удалить транзакцию (по ID)

#### `/api/events`
- **GET** - Получить все события календаря
- **POST** - Создать новое событие
- **PUT** - Обновить событие (по ID)
- **DELETE** - Удалить событие (по ID)

#### `/api/stats`
- **GET** - Получить финансовую статистику

### Использование

```javascript
// Создание транзакции
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'expense',
    category: 'Еда',
    amount: 500,
    description: 'Продукты',
    date: '2025-01-07'
  })
});

// Получение статистики
const stats = await fetch('/api/stats').then(res => res.json());
```

### Особенности

- Все данные хранятся в памяти (для демонстрации)
- CORS настроен для всех доменов
- Поддержка русского языка
- Автоматическая генерация ID
- Валидация входных данных