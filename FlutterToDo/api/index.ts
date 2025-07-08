import type { VercelRequest, VercelResponse } from '@vercel/node';

// Минимальный API для Vercel
// Все реальные операции выполняются через localStorage в браузере
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight OPTIONS запросов
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Возвращаем сообщение что API работает через localStorage
  res.status(200).json({ 
    message: 'API работает через localStorage в браузере',
    timestamp: new Date().toISOString()
  });
}