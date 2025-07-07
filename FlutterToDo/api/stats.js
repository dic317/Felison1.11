// Serverless API для финансовой статистики
export default function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Демонстрационная статистика
    const stats = {
      totalBalance: 125000,
      monthlyIncome: 85000,
      monthlyExpenses: 62000,
      savingsRate: 27.06,
      topCategories: [
        { name: 'Еда', amount: 18500, percentage: 29.8 },
        { name: 'Транспорт', amount: 12000, percentage: 19.4 },
        { name: 'Развлечения', amount: 8500, percentage: 13.7 },
        { name: 'Коммунальные', amount: 7200, percentage: 11.6 }
      ],
      recentTransactions: [
        { id: 1, type: 'expense', category: 'Еда', amount: 450, description: 'Продукты', date: new Date().toISOString() },
        { id: 2, type: 'income', category: 'Зарплата', amount: 85000, description: 'Основная зарплата', date: new Date().toISOString() },
        { id: 3, type: 'expense', category: 'Транспорт', amount: 1200, description: 'Бензин', date: new Date().toISOString() }
      ],
      monthlyTrend: [
        { month: 'Янв', income: 80000, expenses: 65000 },
        { month: 'Фев', income: 82000, expenses: 58000 },
        { month: 'Мар', income: 85000, expenses: 62000 }
      ]
    };

    res.status(200).json(stats);
  } else {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}