import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ExternalLink, Wallet, Calculator } from "lucide-react";
import { Link } from "wouter";

const navigationItems = [
  {
    title: "Календарь",
    description: "Планируйте встречи, отслеживайте финансовые сроки и управляйте встречами",
    icon: Calendar,
    href: "/calendar",
    color: "text-primary",
    bgColor: "bg-primary/20",
    nextEvent: "Завтра 14:00"
  },
  {
    title: "Портал",
    description: "Доступ к внешним ресурсам, партнерским платформам и интегрированным сервисам",
    icon: ExternalLink,
    href: "/portal",
    color: "text-green-400",
    bgColor: "bg-green-400/20",
    quickLinks: "5 Активных"
  },
  {
    title: "Мои Финансы",
    description: "Отслеживайте расходы, управляйте доходами и следите за финансовым здоровьем",
    icon: Wallet,
    href: "/finances",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/20",
    monthlyBalance: "+$2,340"
  },
  {
    title: "Калькулятор",
    description: "Финансовые калькуляторы для кредитов, инвестиций и пенсионного планирования",
    icon: Calculator,
    href: "/calculator",
    color: "text-purple-400",
    bgColor: "bg-purple-400/20",
    toolsAvailable: "8 Доступно"
  }
];

export default function NavigationGrid() {
  return (
    <section className="animate-slide-up">
      <h2 className="text-xl font-semibold mb-8 text-center tracking-wide">Финансовые Инструменты и Сервисы</h2>
      <div className="grid grid-cols-2 gap-4">
        {navigationItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="premium-card group h-32">
              <CardContent className="relative z-10 p-4 flex flex-col items-center justify-center h-full text-center">
                <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`${item.color} w-5 h-5`} />
                </div>
                <h3 className="font-semibold tracking-wide text-[18px]">{item.title}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
