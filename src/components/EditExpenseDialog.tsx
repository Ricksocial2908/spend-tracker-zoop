import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Expense {
  id: number;
  amount: number;
  client: string;
  type: string;
  date: string;
  name: string;
  frequency: string;
  status: string;
}

interface EditExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseUpdated: () => void;
}

export const EditExpenseDialog = ({
  expense,
  open,
  onOpenChange,
  onExpenseUpdated,
}: EditExpenseDialogProps) => {
  const [amount, setAmount] = useState("");
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setClient(expense.client);
      setType(expense.type);
      setDate(expense.date);
      setName(expense.name);
      setFrequency(expense.frequency);
      setStatus(expense.status);
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    if (!amount || !client || !type || !date || !name || !frequency || !status) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("expenses")
        .update({
          amount: parseFloat(amount),
          client,
          type,
          date,
          name,
          frequency,
          status: status.toLowerCase(), // Ensure status is lowercase to match database constraint
        })
        .eq("id", expense.id);

      if (error) throw error;

      toast.success("Expense updated successfully");
      onExpenseUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Expense Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              placeholder="Client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
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
            />
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
                <SelectItem value="Once-off">Once-off</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keep">Keep</SelectItem>
                <SelectItem value="cancel">Cancel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};