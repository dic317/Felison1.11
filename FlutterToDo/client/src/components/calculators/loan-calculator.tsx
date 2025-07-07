import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/utils";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;

    if (principal && rate && term) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
      const totalPayment = monthlyPayment * term;
      const totalInterest = totalPayment - principal;

      setResult({
        monthlyPayment,
        totalPayment,
        totalInterest,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-lg">Кредитный Калькулятор</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="loanAmount" className="text-sm">Сумма Кредита</Label>
            <Input
              id="loanAmount"
              type="number"
              placeholder="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="interestRate" className="text-sm">Годовая Процентная Ставка (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              placeholder="3.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="loanTerm" className="text-sm">Срок Кредита (лет)</Label>
            <Input
              id="loanTerm"
              type="number"
              placeholder="30"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Button onClick={calculateLoan} className="w-full premium-button mt-6">
            Рассчитать Платеж
          </Button>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-lg">Результаты</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="text-sm text-muted-foreground">Ежемесячный Платеж</div>
                <div className="text-xl font-bold text-primary">
                  {formatNumber(result.monthlyPayment)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Общая Сумма Платежей</div>
                  <div className="text-lg font-semibold">
                    {formatNumber(result.totalPayment)}
                  </div>
                </div>
                
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Общие Проценты</div>
                  <div className="text-lg font-semibold text-yellow-400">
                    {formatNumber(result.totalInterest)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Введите данные кредита и нажмите "Рассчитать Платеж" для просмотра результатов.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
