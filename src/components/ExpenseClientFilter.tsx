import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface ExpenseClientFilterProps {
  selectedClient: string;
  onClientChange: (client: string) => void;
  expenses: Array<{ client: string }>;
}

export const ExpenseClientFilter = ({ selectedClient, onClientChange, expenses }: ExpenseClientFilterProps) => {
  const [uniqueClients, setUniqueClients] = useState<string[]>([]);

  useEffect(() => {
    const clients = [...new Set(expenses.map(expense => expense.client))];
    setUniqueClients(clients.sort());
  }, [expenses]);

  return (
    <div className="mb-4">
      <Select value={selectedClient} onValueChange={onClientChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {uniqueClients.map((client) => (
            <SelectItem key={client} value={client}>
              {client}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};