import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";

interface ExpenseFiltersProps {
  filters: {
    client: string;
    type: string;
    name: string;
    amountRange: {
      min: string;
      max: string;
    };
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export const ExpenseFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
}: ExpenseFiltersProps) => {
  return (
    <div className="space-y-4 p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <XIcon className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) =>
              onFilterChange({ ...filters, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Client</label>
          <Input
            placeholder="Filter by client"
            value={filters.client}
            onChange={(e) =>
              onFilterChange({ ...filters, client: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="hosting">Hosting</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.amountRange.min}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  amountRange: { ...filters.amountRange, min: e.target.value },
                })
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.amountRange.max}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  amountRange: { ...filters.amountRange, max: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};