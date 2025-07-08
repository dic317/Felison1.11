import { useState } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/header";
import TransactionForm from "@/components/financial/transaction-form";
import TransactionList from "@/components/financial/transaction-list";
import { formatNumber } from "@/lib/utils";
import { Link } from "wouter";

export default function Finances() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [timePeriod, setTimePeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  console.log('💰 Transactions loaded:', transactions?.length || 0, transactions);
  
  // Force re-render when transactions change
  const [renderKey, setRenderKey] = useState(0);
  
  // Update render key when transactions change
  React.useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [transactions]);

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  // Функция для фильтрации транзакций по временному периоду
  const getFilteredTransactions = () => {
    const now = new Date();
    
    switch (timePeriod) {
      case "week":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);
        return transactions.filter((t: any) => {
          const transactionDate = new Date(t.date || t.createdAt);
          transactionDate.setHours(0, 0, 0, 0);
          return transactionDate >= oneWeekAgo;
        });
      case "month":
        // Показываем транзакции за текущий месяц (с начала месяца до сегодня)
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return transactions.filter((t: any) => {
          const transactionDate = new Date(t.date || t.createdAt);
          return transactionDate >= startOfCurrentMonth && transactionDate <= now;
        });
      case "quarter":
        const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return transactions.filter((t: any) => {
          const transactionDate = new Date(t.date || t.createdAt);
          return transactionDate >= startOfQuarter && transactionDate <= now;
        });
      case "year":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return transactions.filter((t: any) => {
          const transactionDate = new Date(t.date || t.createdAt);
          return transactionDate >= startOfYear && transactionDate <= now;
        });
      case "all":
        return transactions;
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  // Расчеты для основных карточек (используют общий период)
  const totalIncome = filteredTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

  const totalExpenses = filteredTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

  // Фильтрация транзакций для обзора по выбранному месяцу
  const getMonthFilteredTransactions = () => {
    return transactions.filter((t: any) => {
      const transactionDate = new Date(t.date || t.createdAt);
      return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
    });
  };

  const monthFilteredTransactions = getMonthFilteredTransactions();

  const netIncome = totalIncome - totalExpenses;

  console.log('📊 Financial calculations:', {
    totalTransactions: transactions.length,
    filteredTransactions: filteredTransactions.length,
    totalIncome,
    totalExpenses,
    netIncome,
    timePeriod,
    sampleTransaction: transactions[0],
    filteredSample: filteredTransactions[0],
    renderKey
  });
  
  // Log widget values directly
  console.log('🎯 Widget Values:', {
    totalIncomeFormatted: formatNumber(totalIncome),
    totalExpensesFormatted: formatNumber(totalExpenses),
    netIncomeFormatted: formatNumber(netIncome),
    periodLabel: getPeriodLabel()
  });
  const totalAssets = netIncome; // Чистые активы как разница доходов и расходов
  const averageTransaction = filteredTransactions.length > 0 ? (totalIncome + totalExpenses) / filteredTransactions.length : 0;

  // Расчеты для обзора (используют выбранный месяц)
  const monthTotalIncome = monthFilteredTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

  const monthTotalExpenses = monthFilteredTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

  const monthNetIncome = monthTotalIncome - monthTotalExpenses;
  const monthAverageTransaction = monthFilteredTransactions.length > 0 ? (monthTotalIncome + monthTotalExpenses) / monthFilteredTransactions.length : 0;

  // Дополнительная статистика для выбранного месяца
  const getLargestTransaction = () => {
    if (monthFilteredTransactions.length === 0) return 0;
    return Math.max(...monthFilteredTransactions.map((t: any) => parseFloat(t.amount)));
  };

  const getTopIncomeCategory = () => {
    const incomeTransactions = monthFilteredTransactions.filter((t: any) => t.type === 'income');
    if (incomeTransactions.length === 0) return 'Нет данных';
    
    const categoryTotals: { [key: string]: number } = {};
    incomeTransactions.forEach((t: any) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
    });
    
    const topCategory = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b);
    return topCategory[0];
  };

  const getTopExpenseCategory = () => {
    const expenseTransactions = monthFilteredTransactions.filter((t: any) => t.type === 'expense');
    if (expenseTransactions.length === 0) return 'Нет данных';
    
    const categoryTotals: { [key: string]: number } = {};
    expenseTransactions.forEach((t: any) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
    });
    
    const topCategory = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b);
    return topCategory[0];
  };

  const largestTransaction = getLargestTransaction();
  const topIncomeCategory = getTopIncomeCategory();
  const topExpenseCategory = getTopExpenseCategory();

  // Функция для получения названия периода
  const getPeriodLabel = () => {
    switch (timePeriod) {
      case "week": return "За неделю";
      case "month": return "За месяц";
      case "quarter": return "За квартал";
      case "year": return "За год";
      case "all": return "За всё время";
      default: return "За месяц";
    }
  };

  // Названия месяцев на русском языке
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  // Функция для получения названия выбранного месяца
  const getSelectedMonthLabel = () => {
    return `${monthNames[selectedMonth]} ${selectedYear}`;
  };

  // Проверка, отличается ли выбранный месяц от текущего
  const isCurrentMonth = () => {
    const currentDate = new Date();
    return selectedMonth === currentDate.getMonth() && selectedYear === currentDate.getFullYear();
  };

  // Функция для перехода к текущему месяцу
  const goToCurrentMonth = () => {
    const currentDate = new Date();
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  };

  // Функция для проверки, доступен ли месяц для выбора
  const isMonthAvailable = (monthIndex: number, year: number) => {
    const currentDate = new Date();
    const monthDate = new Date(year, monthIndex);
    return monthDate <= currentDate;
  };

  // Получение доступных месяцев для выбранного года
  const getAvailableMonths = () => {
    const currentDate = new Date();
    if (selectedYear > currentDate.getFullYear()) {
      return [];
    } else if (selectedYear === currentDate.getFullYear()) {
      // Для текущего года показываем месяцы до текущего включительно
      const availableMonths = [];
      for (let i = 0; i <= currentDate.getMonth(); i++) {
        availableMonths.push({ name: monthNames[i], index: i });
      }
      return availableMonths;
    } else {
      // Для прошлых лет показываем все месяцы
      return monthNames.map((name, index) => ({ name, index }));
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block text-sm">
            ← Назад к Панели
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6 text-yellow-400" />
              <h1 className="text-xl font-bold tracking-wide">Мои Финансы</h1>
            </div>
            <Button 
              className="premium-button text-sm"
              onClick={() => setShowTransactionForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Отслеживайте расходы и управляйте доходами
          </p>
        </div>

        <div className="space-y-4 mb-6" key={renderKey}>
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-muted-foreground">Период анализа:</h2>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="year">Год</SelectItem>
                <SelectItem value="all">Всё время</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общий Доход</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-400">
                {formatNumber(totalIncome)} ({totalIncome})
              </div>
              <p className="text-xs text-muted-foreground">
                {getPeriodLabel()} - {filteredTransactions.length}тр
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общие Расходы</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-400">
                {formatNumber(totalExpenses)} ({totalExpenses})
              </div>
              <p className="text-xs text-muted-foreground">
                {getPeriodLabel()} - {filteredTransactions.length}тр
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Чистый Доход</CardTitle>
              <Wallet className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatNumber(netIncome)} ({netIncome})
              </div>
              <p className="text-xs text-muted-foreground">
                {getPeriodLabel()} - {filteredTransactions.length}тр
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Транзакции</TabsTrigger>
            <TabsTrigger value="overview">Обзор</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <TransactionList 
              transactions={transactions} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-muted-foreground">Месяц для анализа:</h2>
                <div className="flex gap-2 items-center">
                  <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableMonths().map((month) => (
                        <SelectItem key={month.index} value={month.index.toString()}>
                          {month.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                  {!isCurrentMonth() && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToCurrentMonth}
                      className="text-xs bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30"
                    >
                      Сегодня
                    </Button>
                  )}
                </div>
              </div>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Финансовая Сводка - {getSelectedMonthLabel()}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Чистые Активы</span>
                    <span className={`font-semibold ${monthNetIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatNumber(monthNetIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Общий Доход</span>
                    <span className="font-semibold text-green-400">
                      {formatNumber(monthTotalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Общие Расходы</span>
                    <span className="font-semibold text-red-400">
                      {formatNumber(monthTotalExpenses)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Активность за {getSelectedMonthLabel()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Всего транзакций</span>
                      <span className="font-semibold">{monthFilteredTransactions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Средняя транзакция</span>
                      <span className="font-semibold">
                        {formatNumber(monthAverageTransaction)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Баланс за месяц</span>
                      <span className={`font-semibold ${monthNetIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {monthNetIncome >= 0 ? '+' : ''}{formatNumber(monthNetIncome)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Детальная Статистика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Наибольшая транзакция</span>
                      <span className="font-semibold text-blue-400">
                        {formatNumber(largestTransaction)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Основной доход</span>
                      <span className="font-semibold text-green-400">
                        {topIncomeCategory}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Основной расход</span>
                      <span className="font-semibold text-red-400">
                        {topExpenseCategory}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {showTransactionForm && (
          <TransactionForm 
            onClose={() => setShowTransactionForm(false)}
          />
        )}
      </main>
    </div>
  );
}
