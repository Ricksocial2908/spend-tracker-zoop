import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export const ExpenseTypeFilter = ({ selectedType, onTypeChange }: ExpenseTypeFilterProps) => {
  return (
    <div className="mb-4">
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          <SelectItem value="software">Software</SelectItem>
          <SelectItem value="hardware">Hardware</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="hosting">Hosting</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};