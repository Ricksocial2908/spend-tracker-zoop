
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  amount: number;
  salesPrice?: number;
  className?: string;
}

export const ProjectCard = ({ title, amount, salesPrice, className }: ProjectCardProps) => {
  return (
    <div
      className={cn(
        "p-6 rounded-xl glass-card transition-all duration-200 hover:bg-white/5",
        className
      )}
    >
      <h3 className="text-sm font-medium text-white/60 mb-2">{title}</h3>
      <div className="space-y-1">
        <p className="text-3xl font-semibold text-white">
          €{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        {salesPrice !== undefined && (
          <p className="text-sm text-white/60">
            Sales Price: €{salesPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  );
};
