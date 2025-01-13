import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

interface CSVExpense {
  name: string;
  amount: string;
  client: string;
  type: string;
  date: string;
  frequency: string;
}

interface ExpenseCSVUploadProps {
  onUploadComplete: () => void;
}

export const ExpenseCSVUpload = ({ onUploadComplete }: ExpenseCSVUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      Papa.parse<CSVExpense>(text, {
        header: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            toast.error("Error parsing CSV file");
            console.error(results.errors);
            return;
          }

          try {
            const { error } = await supabase
              .from("expenses")
              .insert(
                results.data.map((row) => ({
                  name: row.name,
                  amount: parseFloat(row.amount),
                  client: row.client,
                  type: row.type,
                  date: row.date,
                  frequency: row.frequency,
                }))
              );

            if (error) throw error;

            toast.success(`Successfully imported ${results.data.length} expenses`);
            onUploadComplete();
          } catch (error) {
            console.error("Error inserting data:", error);
            toast.error("Error uploading expenses");
          }
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Error reading file");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
        disabled={isUploading}
      />
      <label htmlFor="csv-upload">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <span>
            <UploadIcon className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Import CSV"}
          </span>
        </Button>
      </label>
    </div>
  );
};