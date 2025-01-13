import { useState, useEffect } from "react";
import { ExpenseCard } from "@/components/ExpenseCard";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseCSVUpload } from "@/components/ExpenseCSVUpload";
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

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState({
    client: "",
    type: "",
    name: "",
    dateRange: {
      start: "",
      end: "",
    },
    amountRange: {
      min: "",
      max: "",
    },
  });

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return;
    }

    setExpenses(data || []);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    const { error } = await supabase.from("expenses").insert([newExpense]);

    if (error) {
      console.error("Error adding expense:", error);
      return;
    }

    fetchExpenses();
  };

  const handleClearFilters = () => {
    setFilters({
      client: "",
      type: "",
      name: "",
      dateRange: {
        start: "",
        end: "",
      },
      amountRange: {
        min: "",
        max: "",
      },
    });
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesClient =
      !filters.client ||
      expense.client.toLowerCase().includes(filters.client.toLowerCase());
    const matchesType = !filters.type || expense.type === filters.type;
    const matchesName =
      !filters.name ||
      expense.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesDateStart =
      !filters.dateRange.start || expense.date >= filters.dateRange.start;
    const matchesDateEnd =
      !filters.dateRange.end || expense.date <= filters.dateRange.end;
    const matchesMinAmount =
      !filters.amountRange.min ||
      expense.amount >= parseFloat(filters.amountRange.min);
    const matchesMaxAmount =
      !filters.amountRange.max ||
      expense.amount <= parseFloat(filters.amountRange.max);

    return (
      matchesClient &&
      matchesType &&
      matchesName &&
      matchesDateStart &&
      matchesDateEnd &&
      matchesMinAmount &&
      matchesMaxAmount
    );
  });

  const calculateMonthlyTotal = (expenses: Expense[]) => {
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        const currentDate = new Date();
        return (
          expenseDate.getMonth() === currentDate.getMonth() &&
          expenseDate.getFullYear() === currentDate.getFullYear() &&
          expense.frequency === "monthly" &&
          expense.status === "keep"
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const calculateYearlyTotal = (expenses: Expense[]) => {
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(expense => expense.status === "keep")
      .reduce((sum, expense) => {
        if (expense.frequency === "monthly") {
          // Monthly expenses are multiplied by 12 for yearly total
          return sum + (expense.amount * 12);
        } else if (expense.frequency === "yearly") {
          // Yearly expenses are added directly
          return sum + expense.amount;
        }
        return sum;
      }, 0);
  };

  const monthlyTotal = calculateMonthlyTotal(filteredExpenses);
  const yearlyTotal = calculateYearlyTotal(filteredExpenses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">
            Expenses Tracker
          </h1>
          <ExpenseCSVUpload onUploadComplete={fetchExpenses} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpenseCard title="Monthly Total" amount={monthlyTotal} />
          <ExpenseCard title="Yearly Total" amount={yearlyTotal} />
        </div>

        <ExpenseForm onAddExpense={handleAddExpense} />

        <ExpenseFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        <ExpenseList expenses={filteredExpenses} onExpenseUpdated={fetchExpenses} />
      </div>
    </div>
  );
};

export default Index;