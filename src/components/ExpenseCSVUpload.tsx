import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon, DownloadIcon } from "lucide-react";
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

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const parseAmount = (amountStr: string, rowIndex: number): number => {
    if (!amountStr || amountStr.trim() === '') {
      throw new Error(`Row ${rowIndex + 1}: Amount cannot be empty`);
    }
    
    // Remove any currency symbols, spaces, and commas
    const cleanedAmount = amountStr.replace(/[^0-9.-]/g, '');
    const parsedAmount = parseFloat(cleanedAmount);
    
    if (isNaN(parsedAmount)) {
      throw new Error(`Row ${rowIndex + 1}: Invalid amount format: ${amountStr}`);
    }
    
    return parsedAmount;
  };

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
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            toast.error("Error parsing CSV file. Please make sure all required fields are present.");
            console.error(results.errors);
            return;
          }

          // Validate required fields
          const requiredFields = ["name", "amount", "client", "type", "date", "frequency"];
          const missingFields = requiredFields.filter(
            field => !results.meta.fields?.includes(field)
          );

          if (missingFields.length > 0) {
            toast.error(`Missing required fields: ${missingFields.join(", ")}`);
            return;
          }

          try {
            // Validate all rows first before attempting insertion
            const validatedData = results.data.map((row, index) => {
              if (!row.name || row.name.trim() === '') {
                throw new Error(`Row ${index + 1}: Name cannot be empty`);
              }

              if (!row.date || !isValidDate(row.date)) {
                throw new Error(`Row ${index + 1}: Invalid date format for expense: ${row.name}`);
              }

              let amount;
              try {
                amount = parseAmount(row.amount, index);
              } catch (error) {
                throw new Error(`Row ${index + 1}: Invalid amount for expense "${row.name}": ${error.message}`);
              }

              if (!row.client || row.client.trim() === '') {
                throw new Error(`Row ${index + 1}: Client cannot be empty for expense: ${row.name}`);
              }

              if (!row.type || row.type.trim() === '') {
                throw new Error(`Row ${index + 1}: Type cannot be empty for expense: ${row.name}`);
              }
      
              // Convert type to sentence case
              const type = row.type.trim();
              row.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

              if (!row.frequency || row.frequency.trim() === '') {
                throw new Error(`Row ${index + 1}: Frequency cannot be empty for expense: ${row.name}`);
              }
      
              // Convert frequency to sentence case
              const frequency = row.frequency.trim();
              row.frequency = frequency.charAt(0).toUpperCase() + frequency.slice(1).toLowerCase();

              return {
                name: row.name.trim(),
                amount: amount,
                client: row.client.trim(),
                type: row.type.trim(),
                date: new Date(row.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
                frequency: row.frequency.trim(),
              };
            });

            const { error } = await supabase
              .from("expenses")
              .insert(validatedData);

            if (error) throw error;

            toast.success(`Successfully imported ${validatedData.length} expenses`);
            onUploadComplete();
          } catch (error) {
            console.error("Error processing data:", error);
            toast.error(error.message);
          }
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Error: " + error.message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const downloadTemplate = () => {
    const headers = ["name", "amount", "client", "type", "date", "frequency"];
    const sampleData = [
      {
        name: "Office Supplies",
        amount: "100.00",
        client: "Internal",
        type: "Operating",
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        frequency: "monthly",
      },
    ];

    const csv = Papa.unparse({
      fields: headers,
      data: sampleData,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "expense-template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Template downloaded successfully");
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
      <Button variant="outline" onClick={downloadTemplate}>
        <DownloadIcon className="w-4 h-4 mr-2" />
        Download Template
      </Button>
    </div>
  );
};