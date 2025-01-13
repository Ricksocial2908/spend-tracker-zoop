import { useState } from "react";
import { ExpenseCard } from "@/components/ExpenseCard";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseList } from "@/components/ExpenseList";

interface Expense {
  id: number;
  amount: number;
  client: string;
  type: string;
  date: string;
  name: string;
  frequency: string;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState({
    client: "",
    type: "",
    dateRange: {
      start: "",
      end: "",
    },
    amountRange: {
      min: "",
      max: "",
    },
  });

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses([
      ...expenses,
      {
        ...newExpense,
        id: Date.now(),
      },
    ]);
  };

  const handleClearFilters = () => {
    setFilters({
      client: "",
      type: "",
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
    const matchesClient = !filters.client || expense.client.toLowerCase().includes(filters.client.toLowerCase());
    const matchesType = !filters.type || expense.type === filters.type;
    const matchesDateStart = !filters.dateRange.start || expense.date >= filters.dateRange.start;
    const matchesDateEnd = !filters.dateRange.end || expense.date <= filters.dateRange.end;
    const matchesMinAmount = !filters.amountRange.min || expense.amount >= parseFloat(filters.amountRange.min);
    const matchesMaxAmount = !filters.amountRange.max || expense.amount <= parseFloat(filters.amountRange.max);

    return (
      matchesClient &&
      matchesType &&
      matchesDateStart &&
      matchesDateEnd &&
      matchesMinAmount &&
      matchesMaxAmount
    );
  });

  const totalMonthly = filteredExpenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear() &&
        expense.frequency === "monthly"
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalYearly = filteredExpenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return (
        expenseDate.getFullYear() === currentDate.getFullYear() &&
        expense.frequency === "yearly"
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-semibold text-gray-900">Expenses Tracker</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpenseCard title="Monthly Total" amount={totalMonthly} />
          <ExpenseCard title="Yearly Total" amount={totalYearly} />
        </div>

        <ExpenseForm onAddExpense={handleAddExpense} />
        
        <ExpenseFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        <ExpenseList expenses={filteredExpenses} />
      </div>
    </div>
  );
};

export default Index;