import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  userId: z.number().default(1),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onClose: () => void;
}

const incomeCategories = ["Зарплата", "Фриланс", "Инвестиции", "Бизнес", "Другое"];
const expenseCategories = ["Еда", "Транспорт", "Развлечения", "Коммунальные", "Здравоохранение", "Покупки", "Другое"];

export default function TransactionForm({ onClose }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: (data: TransactionFormData) => apiRequest("POST", "/api/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      onClose();
    },
  });

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      category: "",
      amount: "",
      description: "",
      userId: 1,
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    // Если выбрано "Другое", проверяем наличие пользовательской категории
    if (data.category === "Другое") {
      if (!customCategory.trim()) {
        form.setError("category", { 
          type: "manual", 
          message: "Введите название новой категории" 
        });
        return;
      }
      data.category = customCategory.trim();
    }
    createTransactionMutation.mutate(data);
  };

  const categories = transactionType === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Добавить Транзакцию</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTransactionType(value as "income" | "expense");
                        form.setValue("category", "");
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип транзакции" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Доход</SelectItem>
                        <SelectItem value="expense">Расход</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowCustomCategory(value === "Другое");
                        if (value !== "Другое") {
                          setCustomCategory("");
                        }
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showCustomCategory && (
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Новая категория
                  </label>
                  <Input
                    placeholder="Введите название новой категории"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сумма</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0.00" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание (необязательно)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Описание транзакции" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 premium-button"
                  disabled={createTransactionMutation.isPending}
                >
                  {createTransactionMutation.isPending ? "Добавляется..." : "Добавить Транзакцию"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
