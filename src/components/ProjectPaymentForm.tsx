import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [paymentType, setPaymentType] = useState<'contractor' | 'fiverr' | 'company'>('contractor');

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
          payment_type: paymentType,
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Payment</CardTitle>
        <CardDescription>Record a new payment for this project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/80 backdrop-blur-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidAmount">Paid Amount</Label>
              <Input
                id="paidAmount"
                type="number"
                placeholder="0.00"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select
                value={paymentType}
                onValueChange={(value: 'contractor' | 'fiverr' | 'company') => setPaymentType(value)}
              >
                <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="fiverr">Fiverr</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceRef">Invoice Reference</Label>
              <Input
                id="invoiceRef"
                type="text"
                placeholder="INV-001"
                value={invoiceReference}
                onChange={(e) => setInvoiceReference(e.target.value)}
                className="bg-white/80 backdrop-blur-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="bg-white/80 backdrop-blur-sm"
                required
              />
            </div>
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
      </CardContent>
    </Card>
  );
};