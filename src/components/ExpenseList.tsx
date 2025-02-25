import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon, CheckCircleIcon, XCircleIcon, ArrowUpDown, DownloadIcon, FileText } from "lucide-react";
import { useState } from "react";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";

interface Expense {
  id: number;
  amount: number;
  client: string;
  type: string;
  date: string;
  name: string;
  frequency: string;
  status: string;
  used_for: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseUpdated: () => void;
}

type SortField = 'amount' | 'name' | 'client' | 'date' | 'frequency' | 'used_for';
type SortDirection = 'asc' | 'desc';

export const ExpenseList = ({ expenses, onExpenseUpdated }: ExpenseListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditDialogOpen(true);
  };

  const handleStatusToggle = async (expense: Expense) => {
    const newStatus = expense.status === "keep" ? "cancel" : "keep";
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ status: newStatus })
        .eq("id", expense.id);

      if (error) throw error;

      toast.success(`Expense ${newStatus === "keep" ? "kept" : "cancelled"}`);
      onExpenseUpdated();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleRowClick = (expenseId: number) => {
    setHighlightedIds(prev => {
      if (prev.includes(expenseId)) {
        return prev.filter(id => id !== expenseId);
      } else {
        return [...prev, expenseId];
      }
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'amount':
        return (a.amount - b.amount) * multiplier;
      case 'name':
        return a.name.localeCompare(b.name) * multiplier;
      case 'client':
        return a.client.localeCompare(b.client) * multiplier;
      case 'date':
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier;
      case 'frequency':
        return a.frequency.localeCompare(b.frequency) * multiplier;
      case 'used_for':
        return a.used_for.localeCompare(b.used_for) * multiplier;
      default:
        return 0;
    }
  });

  const calculateTotalAmount = (expenses: Expense[]) => {
    return expenses
      .filter(expense => expense.status === "keep")
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const total = calculateTotalAmount(sortedExpenses);

  const handleDownloadCSV = () => {
    const csvData = expenses.map(expense => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Name: expense.name,
      Client: expense.client,
      Type: expense.type,
      Frequency: expense.frequency,
      Amount: expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      Status: expense.status
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV downloaded successfully");
  };

  const SortButton = ({ field, label }: { field: SortField, label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="hover:bg-muted/30"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <>
      <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 animate-fade-in">
        <div className="flex justify-end p-4">
          <Button
            variant="outline"
            onClick={handleDownloadCSV}
            className="mb-4"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="date" label="Date" />
              </TableHead>
              <TableHead>
                <SortButton field="name" label="Expense Name" />
              </TableHead>
              <TableHead>
                <SortButton field="client" label="Client" />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <SortButton field="frequency" label="Frequency" />
              </TableHead>
              <TableHead>
                <SortButton field="used_for" label="Used For" />
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="amount" label="Amount" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExpenses.map((expense) => (
              <TableRow 
                key={expense.id}
                onClick={() => handleRowClick(expense.id)}
                className={`cursor-pointer transition-colors ${
                  highlightedIds.includes(expense.id) 
                    ? "bg-blue-200 hover:bg-blue-300" 
                    : expense.status === "keep"
                    ? "bg-blue-50 hover:bg-blue-100"
                    : expense.status === "cancel"
                    ? "bg-red-50 hover:bg-red-100"
                    : "hover:bg-muted/50"
                }`}
              >
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.name}</TableCell>
                <TableCell>{expense.client}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {expense.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {expense.frequency}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FileText className="h-3 w-3" />
                    {expense.used_for}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  €{expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === "keep"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {expense.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(expense);
                      }}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(expense);
                      }}
                    >
                      {expense.status === "keep" ? (
                        <XCircleIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-gray-50/50">
            <TableRow>
              <TableCell colSpan={6} className="text-right font-medium">
                Total Amount (Active Expenses):
              </TableCell>
              <TableCell className="text-right font-bold">
                €{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
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
