import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";

export default function QuickStats() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/1"],
  });

  return (
    <section className="mt-16 animate-fade-in">
      <h2 className="text-xl font-semibold mb-8 text-center tracking-wide">Quick Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="premium-card text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-green-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Total Assets</h3>
            <p className="text-2xl font-bold text-green-400">
              {user ? formatCurrency(user.totalAssets) : "$0"}
            </p>
            <p className="text-muted-foreground text-sm mt-2">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="premium-card text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <PiggyBank className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Monthly Savings</h3>
            <p className="text-2xl font-bold text-primary">
              {user ? formatCurrency(user.monthlySavings) : "$0"}
            </p>
            <p className="text-muted-foreground text-sm mt-2">Goal: $4,000</p>
          </CardContent>
        </Card>
        
        <Card className="premium-card text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-yellow-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Credit Score</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {user?.creditScore || 0}
            </p>
            <p className="text-muted-foreground text-sm mt-2">Excellent rating</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
