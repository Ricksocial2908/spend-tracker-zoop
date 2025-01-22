import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { UploadIcon } from "lucide-react";

interface ProjectPaymentCSVUploadProps {
  projectId: number;
  onUploadComplete: () => void;
}

export const ProjectPaymentCSVUpload = ({ projectId, onUploadComplete }: ProjectPaymentCSVUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const batchId = `batch_${Date.now()}`;

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const payments = results.data.map((row: any) => ({
            project_id: projectId,
            invoice_reference: row.invoice_reference || `INV-${Date.now()}`,
            amount: Number(row.amount) || 0,
            paid_amount: Number(row.paid_amount) || 0,
            payment_date: row.payment_date || new Date().toISOString().split('T')[0],
            payment_type: row.payment_type || 'contractor',
            contractor_name: row.contractor_name || null,
            import_batch_id: batchId
          }));

          const { error } = await supabase
            .from('project_payments')
            .insert(payments);

          if (error) {
            throw error;
          }

          toast.success("CSV data imported successfully");
          onUploadComplete();
        },
        error: (error) => {
          throw new Error(error.message);
        }
      });
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast.error("Failed to import CSV data");
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="max-w-xs"
      />
      <Button variant="outline" disabled={isUploading}>
        <UploadIcon className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload CSV"}
      </Button>
    </div>
  );
};