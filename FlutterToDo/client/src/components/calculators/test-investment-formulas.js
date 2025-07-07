// Тестирование формул инвестиционного калькулятора

// Базовые параметры для тестирования
const testCases = [
  {
    name: "Тест 1: Только начальный капитал",
    principal: 10000,
    monthly: 0,
    rate: 0.10, // 10% годовых
    years: 1
  },
  {
    name: "Тест 2: Начальный капитал + ежемесячные взносы",
    principal: 10000,
    monthly: 1000,
    rate: 0.10, // 10% годовых  
    years: 1
  }
];

// Функция расчета с разной периодичностью
function calculateCompound(principal, monthly, rate, years, frequency) {
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
  if (monthly > 0) {
    const monthsTotal = years * 12;
    for (let month = 1; month <= monthsTotal; month++) {
      const remainingYears = (monthsTotal - month) / 12;
      const remainingPeriods = remainingYears * n;
      futureValueContributions += monthly * Math.pow(1 + periodicRate, remainingPeriods);
    }
  }
  
  return futureValuePrincipal + futureValueContributions;
}

// Ожидаемые результаты (эталонные формулы)
function expectedYearly(principal, monthly, rate, years) {
  // Ежегодное реинвестирование = сложные проценты раз в год
  const futureValuePrincipal = principal * Math.pow(1 + rate, years);
  
  // Ежемесячные взносы с ежегодным реинвестированием
  let futureValueContributions = 0;
  if (monthly > 0) {
    for (let month = 1; month <= years * 12; month++) {
      const remainingYears = (years * 12 - month) / 12;
      futureValueContributions += monthly * Math.pow(1 + rate, remainingYears);
    }
  }
  
  return futureValuePrincipal + futureValueContributions;
}

function expectedDaily(principal, monthly, rate, years) {
  // Ежедневное реинвестирование
  const dailyRate = rate / 365;
  const days = years * 365;
  const futureValuePrincipal = principal * Math.pow(1 + dailyRate, days);
  
  let futureValueContributions = 0;
  if (monthly > 0) {
    for (let month = 1; month <= years * 12; month++) {
      const remainingYears = (years * 12 - month) / 12;
      const remainingDays = remainingYears * 365;
      futureValueContributions += monthly * Math.pow(1 + dailyRate, remainingDays);
    }
  }
  
  return futureValuePrincipal + futureValueContributions;
}

console.log("=== ТЕСТИРОВАНИЕ ФОРМУЛ ИНВЕСТИЦИОННОГО КАЛЬКУЛЯТОРА ===\n");

testCases.forEach(test => {
  console.log(`${test.name}:`);
  console.log(`Параметры: начальный=${test.principal}, ежемесячный=${test.monthly}, ставка=${test.rate*100}%, срок=${test.years} лет\n`);
  
  const frequencies = ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'];
  
  frequencies.forEach(freq => {
    const result = calculateCompound(test.principal, test.monthly, test.rate, test.years, freq);
    console.log(`${freq.padEnd(10)}: ${result.toLocaleString('ru-RU', {maximumFractionDigits: 2})}`);
  });
  
  // Проверка логики: daily >= weekly >= monthly >= quarterly >= yearly
  const yearly = calculateCompound(test.principal, test.monthly, test.rate, test.years, 'yearly');
  const daily = calculateCompound(test.principal, test.monthly, test.rate, test.years, 'daily');
  
  console.log(`\nПроверка: daily (${daily.toFixed(2)}) >= yearly (${yearly.toFixed(2)}) = ${daily >= yearly ? 'ВЕРНО' : 'ОШИБКА'}`);
  console.log(`Разница: ${(daily - yearly).toFixed(2)}\n`);
  console.log("---\n");
});

