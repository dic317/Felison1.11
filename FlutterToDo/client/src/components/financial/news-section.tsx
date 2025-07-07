import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function NewsSection() {
  return (
    <section className="mb-8 animate-fade-in">
      <Card className="premium-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
        
        <CardContent className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-wide">Новости и Аналитика</h2>
            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">В реальном времени</Badge>
          </div>
          
          <div className="space-y-3">
            <Card className="glass-effect">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Обзор Рынка</h3>
                    <span className="text-muted-foreground text-xs">S&P 500</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-sm">+2.4%</span>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Ваш Портфель</h3>
                    <span className="text-muted-foreground text-xs">Общая Стоимость</span>
                  </div>
                  <span className="text-lg font-bold">$24,850</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
