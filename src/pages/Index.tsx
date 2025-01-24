import { useState, useEffect } from "react";
import { ExpenseCard } from "@/components/ExpenseCard";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseCSVUpload } from "@/components/ExpenseCSVUpload";
import { ExpenseTypeFilter } from "@/components/ExpenseTypeFilter";
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
  const [selectedType, setSelectedType] = useState("");

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

  const filteredExpenses = expenses.filter((expense) => {
    if (!selectedType) return true;
    return expense.type.toLowerCase() === selectedType.toLowerCase();
  });

  const calculateTotalAmount = (expenses: Expense[]) => {
    return expenses
      .filter(expense => expense.status === "keep")
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const totalAmount = calculateTotalAmount(filteredExpenses);

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
          <ExpenseCard title="Total Active Expenses" amount={totalAmount} />
        </div>

        <ExpenseForm onAddExpense={handleAddExpense} />
        
        <ExpenseTypeFilter 
          selectedType={selectedType} 
          onTypeChange={setSelectedType} 
        />

        <ExpenseList expenses={filteredExpenses} onExpenseUpdated={fetchExpenses} />
      </div>
    </div>
  );
};

export default Index;