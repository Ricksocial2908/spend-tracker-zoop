import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { EditExpenseDialog } from "./EditExpenseDialog";

interface Expense {
  id: number;
  amount: number;
  client: string;
  type: string;
  date: string;
  name: string;
  frequency: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseUpdated: () => void;
}

export const ExpenseList = ({ expenses, onExpenseUpdated }: ExpenseListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Expense Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.name}</TableCell>
                <TableCell>{expense.client}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {expense.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  €{expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(expense)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <EditExpenseDialog
        expense={selectedExpense}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onExpenseUpdated={onExpenseUpdated}
      />
    </>
  );
};