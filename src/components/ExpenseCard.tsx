
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  title: string;
  amount: number;
  className?: string;
}

export const ExpenseCard = ({ title, amount, className }: ExpenseCardProps) => {
  return (
    <div
      className={cn(
        "p-6 rounded-xl glass-card transition-all duration-200 hover:bg-white/5",
        className
      )}
    >
      <h3 className="text-sm font-medium text-white/60 mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-white">
        €{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};
