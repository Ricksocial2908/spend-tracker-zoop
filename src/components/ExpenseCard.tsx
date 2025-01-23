import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  title: string;
  amount?: number;
  className?: string;
}

export const ExpenseCard = ({ title, amount = 0, className }: ExpenseCardProps) => {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in",
        className
      )}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-semibold">
        {amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </p>
    </div>
  );
};