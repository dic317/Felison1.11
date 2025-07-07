// Клиентский API с localStorage для работы без сервера
export interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  description?: string;
  category: string;
  createdAt: string;
}

class LocalStorageAPI {
  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Транзакции
  getTransactions(): Transaction[] {
    return this.getFromStorage('felison_transactions', []);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      amount: Number(transaction.amount),
      createdAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    this.saveToStorage('felison_transactions', transactions);
    console.log('Added transaction to localStorage:', newTransaction);
    return newTransaction;
  }

  deleteTransaction(id: number): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    this.saveToStorage('felison_transactions', filtered);
    return true;
  }

  // События календаря
  getEvents(): CalendarEvent[] {
    const defaultEvents: CalendarEvent[] = [
      {
        id: 1,
        title: 'Добро пожаловать в Felison!',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        description: 'Начните управлять своими финансами',
        category: 'общее',
        createdAt: new Date().toISOString()
      }
    ];
    
    return this.getFromStorage('felison_events', defaultEvents);
  }

  addEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>): CalendarEvent {
    const events = this.getEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    this.saveToStorage('felison_events', events);
    console.log('Added event to localStorage:', newEvent);
    return newEvent;
  }

  updateEvent(id: number, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    events[index] = { ...events[index], ...updates };
    this.saveToStorage('felison_events', events);
    return events[index];
  }

  deleteEvent(id: number): boolean {
    const events = this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    this.saveToStorage('felison_events', filtered);
    return true;
  }

  // Статистика
  getStats() {
    const transactions = this.getTransactions();
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    return {
      totalBalance: balance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      savingsRate: income > 0 ? ((income - expenses) / income * 100) : 0,
      topCategories: this.getTopCategories(transactions),
      recentTransactions: transactions.slice(-10).reverse(),
      monthlyTrend: [
        { month: 'Янв', income: income * 0.8, expenses: expenses * 0.9 },
        { month: 'Фев', income: income * 0.9, expenses: expenses * 0.8 },
        { month: 'Мар', income, expenses }
      ]
    };
  }

  private getTopCategories(transactions: Transaction[]) {
    const expenseCategories = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const totalExpenses = Object.values(expenseCategories).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(expenseCategories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses * 100) : 0
      }));
  }
}

export const localAPI = new LocalStorageAPI();