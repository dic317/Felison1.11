import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [investmentTerm, setInvestmentTerm] = useState("");
  const [compoundInterest, setCompoundInterest] = useState(true);
  const [compoundingFrequency, setCompoundingFrequency] = useState("monthly");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [result, setResult] = useState<{
    finalAmount: number;
    totalContributions: number;
    totalEarnings: number;
  } | null>(null);

  const getCompoundingPeriods = (frequency: string) => {
    switch (frequency) {
      case "daily": return 365;
      case "weekly": return 52;
      case "monthly": return 12;
      case "quarterly": return 4;
      case "yearly": return 1;
      default: return 12;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily": return "ежедневно";
      case "weekly": return "еженедельно";
      case "monthly": return "ежемесячно";
      case "quarterly": return "ежеквартально";
      case "yearly": return "ежегодно";
      default: return "ежемесячно";
    }
  };

  const calculateInvestment = () => {
    const principal = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const annualRate = parseFloat(annualReturn) / 100;
    const years = parseFloat(investmentTerm);

    if (annualRate && years) {
      let finalAmount;
      
      if (compoundInterest) {
        // Реинвестирование с выбранной периодичностью
        const n = getCompoundingPeriods(compoundingFrequency);
        const periodicRate = annualRate / n; // ставка за период реинвестирования
        const periods = years * n; // количество периодов реинвестирования
        
        // Future value of initial investment with compound interest
        const futureValuePrincipal = principal * Math.pow(1 + periodicRate, periods);
        
        // Future value of monthly contributions
        // Используем формулу для аннуитета с реинвестированием
        let futureValueContributions = 0;
        
        if (monthly > 0) {
          // Расчет будущей стоимости ежемесячных взносов с учетом периодичности реинвестирования
          const monthsTotal = years * 12;
          
          for (let month = 1; month <= monthsTotal; month++) {
            // Количество периодов реинвестирования от момента взноса до конца
            const remainingYears = (monthsTotal - month) / 12;
            const remainingPeriods = remainingYears * n;
            
            // Будущая стоимость этого взноса
            futureValueContributions += monthly * Math.pow(1 + periodicRate, remainingPeriods);
          }
        }
        
        finalAmount = futureValuePrincipal + futureValueContributions;
      } else {
        // Без реинвестирования - простые проценты
        const totalContributions = principal + (monthly * years * 12);
        const simpleInterest = principal * annualRate * years; // проценты только с начального капитала
        
        finalAmount = totalContributions + simpleInterest;
      }
      
      const totalContributions = principal + (monthly * years * 12);
      const totalEarnings = finalAmount - totalContributions;

      setResult({
        finalAmount,
        totalContributions,
        totalEarnings,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-lg">Калькулятор Инвестиций</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="initialAmount" className="text-sm">Начальная Инвестиция</Label>
            <Input
              id="initialAmount"
              type="number"
              placeholder="100000"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="monthlyContribution" className="text-sm">Ежемесячный Взнос</Label>
            <Input
              id="monthlyContribution"
              type="number"
              placeholder="50000"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="annualReturn" className="text-sm">Ожидаемая Годовая Доходность (%)</Label>
            <Input
              id="annualReturn"
              type="number"
              step="0.01"
              placeholder="7"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="investmentTerm" className="text-sm">Срок Инвестирования (лет)</Label>
            <Input
              id="investmentTerm"
              type="number"
              placeholder="20"
              value={investmentTerm}
              onChange={(e) => setInvestmentTerm(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-3 mt-4">
            <div className="flex items-center space-x-2">
              <div>
                <Label htmlFor="compound-interest" className="text-sm font-medium">
                  Реинвестирование
                </Label>
                <div className="text-xs text-muted-foreground">
                  (Сложные Проценты)
                </div>
              </div>
              {compoundInterest && (
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Настройки Реинвестирования</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Периодичность Реинвестирования</Label>
                        <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Ежедневно</SelectItem>
                            <SelectItem value="weekly">Еженедельно</SelectItem>
                            <SelectItem value="monthly">Ежемесячно</SelectItem>
                            <SelectItem value="quarterly">Ежеквартально</SelectItem>
                            <SelectItem value="yearly">Ежегодно</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Как часто проценты добавляются к основному капиталу
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <Switch
              id="compound-interest"
              checked={compoundInterest}
              onCheckedChange={setCompoundInterest}
            />
          </div>
          
          <Button onClick={calculateInvestment} className="w-full premium-button mt-6">
            Рассчитать Доходность
          </Button>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-lg">
            Результаты
            {result && (
              <div className="text-sm font-normal text-muted-foreground mt-1">
                ({compoundInterest ? `Реинвестирование: ${getFrequencyLabel(compoundingFrequency)}` : 'Без реинвестирования'})
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="text-sm text-muted-foreground">Итоговая Сумма</div>
                <div className="text-xl font-bold text-green-400">
                  {formatNumber(result.finalAmount)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Общие Взносы</div>
                  <div className="text-lg font-semibold">
                    {formatNumber(result.totalContributions)}
                  </div>
                </div>
                
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Общая Прибыль</div>
                  <div className="text-lg font-semibold text-green-400">
                    {formatNumber(result.totalEarnings)}
                  </div>
                </div>
                
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Возврат Инвестиций</div>
                  <div className="text-lg font-semibold text-primary">
                    {result.totalContributions > 0 
                      ? ((result.totalEarnings / result.totalContributions) * 100).toFixed(1)
                      : 0
                    }%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Введите данные инвестиций и нажмите "Рассчитать Доходность" для просмотра прогнозов.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
