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
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
        return;
      }

      setExpenses(data || []);
    } catch (error) {
      console.error("Error in fetchExpenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    try {
      const { error } = await supabase.from("expenses").insert([newExpense]);

      if (error) {
        console.error("Error adding expense:", error);
        return;
      }

      fetchExpenses();
    } catch (error) {
      console.error("Error in handleAddExpense:", error);
    }
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear &&
          expense.frequency === "monthly" &&
          expense.status === "keep"
        );
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  };

  const calculateYearlyTotal = (expenses: Expense[]) => {
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(expense => expense.status === "keep")
      .reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getFullYear() === currentYear) {
          if (expense.frequency === "monthly") {
            // For monthly expenses, multiply by remaining months in the year
            const currentMonth = new Date().getMonth();
            const remainingMonths = 12 - currentMonth;
            return sum + (Number(expense.amount) * remainingMonths);
          } else if (expense.frequency === "yearly") {
            // Yearly expenses are added directly
            return sum + Number(expense.amount);
          }
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
          <ExpenseCard 
            title="Monthly Total (Current Month)" 
            amount={calculateMonthlyTotal(filteredExpenses)} 
          />
          <ExpenseCard 
            title="Projected Yearly Total" 
            amount={calculateYearlyTotal(filteredExpenses)} 
          />
        </div>

        <ExpenseForm onAddExpense={handleAddExpense} />

        <ExpenseFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        <ExpenseList 
          expenses={filteredExpenses} 
          onExpenseUpdated={fetchExpenses} 
        />
      </div>
    </div>
  );
};

export default Index;