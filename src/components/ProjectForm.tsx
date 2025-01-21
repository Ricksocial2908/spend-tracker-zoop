import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFormProps {
  onProjectAdded: () => void;
  onCancel?: () => void;
}

const CATEGORIES = ['internal', 'contractor', 'services', 'software', 'stock'] as const;
const PROJECT_TYPES = ['fixed_fee', 'time_and_materials', 'retainer'] as const;

export const ProjectForm = ({ onProjectAdded, onCancel }: ProjectFormProps) => {
  const [name, setName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [client, setClient] = useState("");
  const [projectType, setProjectType] = useState<typeof PROJECT_TYPES[number]>("fixed_fee");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [billableRate, setBillableRate] = useState("");
  const [notes, setNotes] = useState("");
  const [internalCost, setInternalCost] = useState("");
  const [externalCost, setExternalCost] = useState("");
  const [softwareCost, setSoftwareCost] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [internalCostCategory, setInternalCostCategory] = useState<typeof CATEGORIES[number]>("internal");
  const [externalCostCategory, setExternalCostCategory] = useState<typeof CATEGORIES[number]>("contractor");
  const [softwareCostCategory, setSoftwareCostCategory] = useState<typeof CATEGORIES[number]>("software");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !projectCode) {
      toast.error("Please enter project name and code");
      return;
    }

    try {
      const { error } = await supabase
        .from("projects")
        .insert({
          name,
          project_code: projectCode,
          client,
          project_type: projectType,
          start_date: startDate || null,
          end_date: endDate || null,
          budget: Number(budget) || 0,
          billable_rate: Number(billableRate) || 0,
          notes,
          internal_cost: Number(internalCost) || 0,
          external_cost: Number(externalCost) || 0,
          software_cost: Number(softwareCost) || 0,
          sales_price: Number(salesPrice) || 0,
          internal_cost_category: internalCostCategory,
          external_cost_category: externalCostCategory,
          software_cost_category: softwareCostCategory,
        });

      if (error) throw error;

      setName("");
      setProjectCode("");
      setClient("");
      setProjectType("fixed_fee");
      setStartDate("");
      setEndDate("");
      setBudget("");
      setBillableRate("");
      setNotes("");
      setInternalCost("");
      setExternalCost("");
      setSoftwareCost("");
      setSalesPrice("");
      setInternalCostCategory("internal");
      setExternalCostCategory("contractor");
      setSoftwareCostCategory("software");
      
      onProjectAdded();
      toast.success("Project added successfully");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
          <Input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Project Code"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          <Select
            value={projectType}
            onValueChange={(value: typeof PROJECT_TYPES[number]) => setProjectType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Billable Rate"
              value={billableRate}
              onChange={(e) => setBillableRate(e.target.value)}
            />
          </div>
          <Input
            type="number"
            placeholder="Sales Price"
            value={salesPrice}
            onChange={(e) => setSalesPrice(e.target.value)}
          />
          <Textarea
            placeholder="Project Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-[120px]"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Internal Cost"
              value={internalCost}
              onChange={(e) => setInternalCost(e.target.value)}
            />
            <Input
              type="number"
              placeholder="External Cost"
              value={externalCost}
              onChange={(e) => setExternalCost(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Software Cost"
              value={softwareCost}
              onChange={(e) => setSoftwareCost(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          <XIcon className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
    </form>
  );
};
