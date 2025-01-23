import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ExpenseCardProps {
  title: string;
  amount?: number;
  className?: string;
}

export const ExpenseCard = ({ title, amount: propAmount, className }: ExpenseCardProps) => {
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    const fetchMonthlyTotal = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .eq("frequency", "monthly")
        .eq("status", "keep");

      if (error) {
        console.error("Error fetching monthly expenses:", error);
        return;
      }

      const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      setMonthlyTotal(total);
    };

    fetchMonthlyTotal();
  }, []);

  const displayAmount = propAmount !== undefined ? propAmount : monthlyTotal;

  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in",
        className
      )}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-semibold">
        {displayAmount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </p>
    </div>
  );
};