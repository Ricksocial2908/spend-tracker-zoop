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
        "p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in",
        className
      )}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="space-y-1">
        <p className="text-3xl font-semibold">
          €{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        {salesPrice !== undefined && (
          <p className="text-sm text-gray-600">
            Sales Price: €{salesPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  );
};