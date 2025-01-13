import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

interface ExpenseFormProps {
  onAddExpense: (expense: {
    amount: number;
    client: string;
    type: string;
    date: string;
  }) => void;
}

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !client || !type || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    onAddExpense({
      amount: parseFloat(amount),
      client,
      type,
      date,
    });

    setAmount("");
    setClient("");
    setType("");
    setDate("");
    
    toast.success("Expense added successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Input
          type="text"
          placeholder="Client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="software">Software</SelectItem>
            <SelectItem value="hardware">Hardware</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        <PlusIcon className="w-4 h-4 mr-2" />
        Add Expense
      </Button>
    </form>
  );
};