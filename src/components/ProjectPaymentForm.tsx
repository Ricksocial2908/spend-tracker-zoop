import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProjectPaymentFormProps {
  projectId: number;
  onPaymentAdded: () => void;
  onCancel: () => void;
}

export const ProjectPaymentForm = ({ projectId, onPaymentAdded, onCancel }: ProjectPaymentFormProps) => {
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [invoiceReference, setInvoiceReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !paymentDate || !invoiceReference) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from("project_payments")
        .insert({
          project_id: projectId,
          amount: Number(amount),
          paid_amount: Number(paidAmount) || 0,
          payment_date: paymentDate,
          invoice_reference: invoiceReference,
        });

      if (error) throw error;

      onPaymentAdded();
      toast.success("Payment added successfully");
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold">Add Payment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Total Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Input
          type="number"
          placeholder="Paid Amount"
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Input
          type="text"
          placeholder="Invoice Reference"
          value={invoiceReference}
          onChange={(e) => setInvoiceReference(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Payment
        </Button>
      </div>
    </form>
  );
};