import { useState, useEffect } from "react";
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
import { PlusIcon, XIcon } from "lucide-react";

interface ExpenseFormProps {
  onAddExpense: (expense: {
    amount: number;
    client: string;
    type: string;
    date: string;
    name: string;
    frequency: string;
    status: string;
    used_for: string;
  }) => void;
  onCancel?: () => void;
}

export const ExpenseForm = ({ onAddExpense, onCancel }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [status, setStatus] = useState("keep");
  const [usedFor, setUsedFor] = useState("");

  useEffect(() => {
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !client || !type || !date || !name || !frequency || !status || !usedFor) {
      toast.error("Please fill in all fields");
      return;
    }

    onAddExpense({
      amount: parseFloat(amount),
      client,
      type,
      date,
      name,
      frequency,
      status: status.toLowerCase(),
      used_for: usedFor,
    });

    setAmount("");
    setClient("");
    setType("");
    setDate("");
    setName("");
    setFrequency("");
    setStatus("keep");
    setUsedFor("");
    
    toast.success("Expense added successfully");
  };

  const handleCancel = () => {
    setAmount("");
    setClient("");
    setType("");
    setDate("");
    setName("");
    setFrequency("");
    setStatus("keep");
    setUsedFor("");
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Expenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
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
            <SelectItem value="Software">Software</SelectItem>
            <SelectItem value="Hardware">Hardware</SelectItem>
            <SelectItem value="Service">Service</SelectItem>
            <SelectItem value="Hosting">Hosting</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger className="bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
            <SelectItem value="Once-off">Once-off</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="keep">Keep</SelectItem>
            <SelectItem value="cancel">Cancel</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Used For"
          value={usedFor}
          onChange={(e) => setUsedFor(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={handleCancel}>
          <XIcon className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>
    </form>
  );
};