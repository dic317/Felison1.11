// Проверка конкретных сценариев для валидации интерфейса

console.log("=== ВАЛИДАЦИЯ РАСЧЕТОВ ДЛЯ ИНТЕРФЕЙСА ===\n");

// Тест со стандартными параметрами
const principal = 100000; // 100,000 начальная сумма
const monthly = 5000;     // 5,000 ежемесячный взнос
const rate = 0.07;        // 7% годовых
const years = 10;         // 10 лет

console.log("Параметры тестирования:");
console.log(`Начальная сумма: ${principal.toLocaleString('ru-RU')}`);
console.log(`Ежемесячный взнос: ${monthly.toLocaleString('ru-RU')}`);
console.log(`Годовая доходность: ${rate * 100}%`);
console.log(`Срок инвестирования: ${years} лет\n`);

function testScenario(frequency) {
  const periods = {
    yearly: 1,
    quarterly: 4,
    monthly: 12,
    weekly: 52,
    daily: 365
  };
  
  const n = periods[frequency];
  const periodicRate = rate / n;
  const totalPeriods = years * n;
  
  // Будущая стоимость начального капитала
  const futureValuePrincipal = principal * Math.pow(1 + periodicRate, totalPeriods);
  
  // Будущая стоимость ежемесячных взносов
  let futureValueContributions = 0;
  const monthsTotal = years * 12;
  
  for (let month = 1; month <= monthsTotal; month++) {
    const remainingYears = (monthsTotal - month) / 12;
    const remainingPeriods = remainingYears * n;
    futureValueContributions += monthly * Math.pow(1 + periodicRate, remainingPeriods);
  }
  
  const finalAmount = futureValuePrincipal + futureValueContributions;
  const totalContributions = principal + (monthly * monthsTotal);
  const totalEarnings = finalAmount - totalContributions;
  const roi = (totalEarnings / totalContributions) * 100;
  
  return {
    finalAmount,
    totalContributions,
    totalEarnings,
    roi
  };
}

const frequencies = [
  { key: 'yearly', label: 'Ежегодно' },
  { key: 'quarterly', label: 'Ежеквартально' },
  { key: 'monthly', label: 'Ежемесячно' },
  { key: 'weekly', label: 'Еженедельно' },
  { key: 'daily', label: 'Ежедневно' }
];

frequencies.forEach(freq => {
  const result = testScenario(freq.key);
  
  console.log(`${freq.label}:`);
  console.log(`  Итоговая сумма: ${result.finalAmount.toLocaleString('ru-RU', {maximumFractionDigits: 0})}`);
  console.log(`  Общие взносы: ${result.totalContributions.toLocaleString('ru-RU', {maximumFractionDigits: 0})}`);
  console.log(`  Общая прибыль: ${result.totalEarnings.toLocaleString('ru-RU', {maximumFractionDigits: 0})}`);
  console.log(`  Возврат инвестиций: ${result.roi.toFixed(1)}%\n`);
});

// Проверка роста доходности с увеличением частоты
const yearlyResult = testScenario('yearly');
const dailyResult = testScenario('daily');
const improvement = ((dailyResult.finalAmount - yearlyResult.finalAmount) / yearlyResult.finalAmount) * 100;

console.log("=== АНАЛИЗ ВЛИЯНИЯ ЧАСТОТЫ РЕИНВЕСТИРОВАНИЯ ===");
console.log(`Прирост от ежедневного vs ежегодного: ${improvement.toFixed(2)}%`);
console.log(`Дополнительная прибыль: ${(dailyResult.finalAmount - yearlyResult.finalAmount).toLocaleString('ru-RU', {maximumFractionDigits: 0})}`);
