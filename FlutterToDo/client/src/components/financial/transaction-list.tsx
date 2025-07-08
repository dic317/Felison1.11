import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { formatNumber, formatDate } from "@/lib/utils";

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: string;
  description?: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionList({ transactions, isLoading }: TransactionListProps) {
  const queryClient = useQueryClient();

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-start justify-between p-3 bg-muted/20 rounded-lg border border-border/50"
            >
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transaction.type === 'income' 
                    ? 'bg-green-400/20 text-green-400' 
                    : 'bg-red-400/20 text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">{transaction.category}</span>
                      <span className={`text-lg font-bold flex-shrink-0 ml-2 ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatNumber(transaction.amount)}
                      </span>
                    </div>
                    {transaction.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{transaction.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => deleteTransactionMutation.mutate(transaction.id)}
                disabled={deleteTransactionMutation.isPending}
                className="text-muted-foreground hover:text-red-400 h-8 w-8 p-0 flex-shrink-0 ml-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
