// Serverless API для управления событиями календаря
let events = [
  {
    id: 1,
    title: 'Добро пожаловать в Felison!',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    description: 'Начните управлять своими финансами',
    category: 'общее'
  }
];
let nextId = 2;

export default function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Получение всех событий
    res.status(200).json(events);
  } else if (req.method === 'POST') {
    // Создание нового события
    const { title, date, time, description, category } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }

    const event = {
      id: nextId++,
      title,
      date,
      time: time || '09:00',
      description: description || '',
      category: category || 'общее',
      createdAt: new Date().toISOString()
    };

    events.push(event);
    res.status(201).json(event);
  } else if (req.method === 'PUT') {
    // Обновление события
    const { id } = req.query;
    const eventIndex = events.findIndex(e => e.id === parseInt(id));
    
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    const { title, date, time, description, category } = req.body;
    events[eventIndex] = {
      ...events[eventIndex],
      title: title || events[eventIndex].title,
      date: date || events[eventIndex].date,
      time: time || events[eventIndex].time,
      description: description || events[eventIndex].description,
      category: category || events[eventIndex].category,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json(events[eventIndex]);
  } else if (req.method === 'DELETE') {
    // Удаление события
    const { id } = req.query;
    const index = events.findIndex(e => e.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    events.splice(index, 1);
    res.status(200).json({ message: 'Событие удалено' });
  } else {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}