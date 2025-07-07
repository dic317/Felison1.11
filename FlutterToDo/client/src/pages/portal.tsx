import { ExternalLink, Globe, CreditCard, TrendingUp, Building, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import { Link } from "wouter";

const externalLinks = [
  {
    title: "Банковский Портал",
    description: "Доступ к вашему основному банковскому счету и услугам",
    icon: Building,
    url: "https://example-bank.com",
    category: "Банк"
  },
  {
    title: "Инвестиционная Платформа",
    description: "Управляйте инвестиционным портфелем и торговлей",
    icon: TrendingUp,
    url: "https://example-invest.com",
    category: "Инвестиции"
  },
  {
    title: "Кредитный Мониторинг",
    description: "Отслеживайте кредитный рейтинг и финансовое здоровье",
    icon: CreditCard,
    url: "https://example-credit.com",
    category: "Кредит"
  },
  {
    title: "Портал Страхования",
    description: "Доступ к страховым полисам и заявкам",
    icon: Shield,
    url: "https://example-insurance.com",
    category: "Страховка"
  },
  {
    title: "Финансовые Новости",
    description: "Последние новости рынка и финансовая аналитика",
    icon: Globe,
    url: "https://example-news.com",
    category: "Новости"
  },
  {
    title: "Налоговые Услуги",
    description: "Подготовка и подача налоговых деклараций",
    icon: Globe,
    url: "https://example-tax.com",
    category: "Налоги"
  }
];

export default function Portal() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block text-sm">
            ← Назад к Панели
          </Link>
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold tracking-wide">Финансовый Портал</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Доступ к внешним ресурсам и сервисам
          </p>
        </div>

        <div className="space-y-4">
          {externalLinks.map((link, index) => (
            <Card key={index} className="premium-card group">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                    <link.icon className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{link.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{link.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-3 group-hover:text-foreground transition-colors">
                  {link.description}
                </p>
                <Button 
                  className="w-full premium-button text-sm" 
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Открыть Портал
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        
      </main>
    </div>
  );
}
