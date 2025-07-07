// Serverless API для управления транзакциями
let transactions = [];
let nextId = 1;

export default function handler(req, res) {
  // Разрешаем CORS для фронтенда
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Получение всех транзакций
    res.status(200).json(transactions);
  } else if (req.method === 'POST') {
    // Создание новой транзакции
    const { type, category, amount, description, date } = req.body;
    
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }

    const transaction = {
      id: nextId++,
      type,
      category,
      amount: parseFloat(amount),
      description: description || '',
      date,
      createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    res.status(201).json(transaction);
  } else if (req.method === 'DELETE') {
    // Удаление транзакции
    const { id } = req.query;
    const index = transactions.findIndex(t => t.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Транзакция не найдена' });
    }

    transactions.splice(index, 1);
    res.status(200).json({ message: 'Транзакция удалена' });
  } else {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}