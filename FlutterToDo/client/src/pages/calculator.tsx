import { Calculator as CalculatorIcon, DollarSign, TrendingUp, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoanCalculator from "@/components/calculators/loan-calculator";
import InvestmentCalculator from "@/components/calculators/investment-calculator";
import { Link } from "wouter";

export default function Calculator() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">
            ← Назад к Панели
          </Link>
          <div className="flex items-center space-x-4">
            <CalculatorIcon className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold tracking-wide">Финансовый Калькулятор</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Финансовые калькуляторы для кредитов, инвестиций и пенсионного планирования
          </p>
        </div>

        <Tabs defaultValue="loan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="loan" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Кредит</span>
            </TabsTrigger>
            <TabsTrigger value="investment" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Инвестиции</span>
            </TabsTrigger>
            <TabsTrigger value="retirement" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Пенсия</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="loan" className="space-y-4">
            <LoanCalculator />
          </TabsContent>
          
          <TabsContent value="investment" className="space-y-4">
            <InvestmentCalculator />
          </TabsContent>
          
          <TabsContent value="retirement" className="space-y-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Пенсионный Калькулятор</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Пенсионный калькулятор скоро появится. Планируйте свое будущее с помощью комплексных инструментов пенсионного планирования.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
