import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlusIcon, XIcon, SaveIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFormProps {
  onProjectAdded: () => void;
  onCancel?: () => void;
  initialData?: {
    id?: number;
    name: string;
    project_code: string | null;
    client: string | null;
    project_type: string | null;
    start_date: string | null;
    end_date: string | null;
    budget: number | null;
    billable_rate: number | null;
    notes: string | null;
    internal_cost: number;
    external_cost: number;
    software_cost: number;
    sales_price: number;
    vr_development_cost: number;
    software_development_cost: number;
    design_cost: number;
    modeling_3d_cost: number;
    rendering_cost: number;
  };
  mode?: 'create' | 'edit';
}

const CREATIVE_DIRECTOR_RATE = 43;
const CATEGORIES = ['internal', 'contractor', 'services', 'software', 'stock'] as const;
const PROJECT_TYPES = ['fixed_fee', 'time_and_materials', 'retainer'] as const;

export const ProjectForm = ({ onProjectAdded, onCancel, initialData, mode = 'create' }: ProjectFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [projectCode, setProjectCode] = useState(initialData?.project_code || "");
  const [client, setClient] = useState(initialData?.client || "");
  const [projectType, setProjectType] = useState<typeof PROJECT_TYPES[number]>(
    (initialData?.project_type as typeof PROJECT_TYPES[number]) || "fixed_fee"
  );
  const [startDate, setStartDate] = useState(initialData?.start_date || "");
  const [endDate, setEndDate] = useState(initialData?.end_date || "");
  const [budget, setBudget] = useState(String(initialData?.budget || ""));
  const [billableRate, setBillableRate] = useState(String(initialData?.billable_rate || ""));
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [creativeDirectorHours, setCreativeDirectorHours] = useState(
    String(Math.round((initialData?.internal_cost || 0) / CREATIVE_DIRECTOR_RATE)) || "0"
  );
  const [externalCost, setExternalCost] = useState(String(initialData?.external_cost || ""));
  const [softwareCost, setSoftwareCost] = useState(String(initialData?.software_cost || ""));
  const [salesPrice, setSalesPrice] = useState(String(initialData?.sales_price || ""));
  const [vrDevelopmentCost, setVrDevelopmentCost] = useState(String(initialData?.vr_development_cost || ""));
  const [softwareDevelopmentCost, setSoftwareDevelopmentCost] = useState(String(initialData?.software_development_cost || ""));
  const [designCost, setDesignCost] = useState(String(initialData?.design_cost || ""));
  const [modeling3dCost, setModeling3dCost] = useState(String(initialData?.modeling_3d_cost || ""));
  const [renderingCost, setRenderingCost] = useState(String(initialData?.rendering_cost || ""));

  // Calculate internal cost based on hours and rate
  const internalCost = Number(creativeDirectorHours) * CREATIVE_DIRECTOR_RATE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !projectCode) {
      toast.error("Please enter project name and code");
      return;
    }

    try {
      const projectData = {
        name,
        project_code: projectCode,
        client,
        project_type: projectType,
        start_date: startDate || null,
        end_date: endDate || null,
        budget: Number(budget) || 0,
        billable_rate: Number(billableRate) || 0,
        notes,
        internal_cost: internalCost,
        external_cost: Number(externalCost) || 0,
        software_cost: Number(softwareCost) || 0,
        sales_price: Number(salesPrice) || 0,
        vr_development_cost: Number(vrDevelopmentCost) || 0,
        software_development_cost: Number(softwareDevelopmentCost) || 0,
        design_cost: Number(designCost) || 0,
        modeling_3d_cost: Number(modeling3dCost) || 0,
        rendering_cost: Number(renderingCost) || 0,
      };

      if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from("projects")
          .insert(projectData);

        if (error) throw error;
        toast.success("Project added successfully");
      }

      onProjectAdded();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} project`);
    }
  };

  // Calculate total cost including new categories
  const totalCost = internalCost + 
    Number(externalCost || 0) + 
    Number(softwareCost || 0) +
    Number(vrDevelopmentCost || 0) +
    Number(softwareDevelopmentCost || 0) +
    Number(designCost || 0) +
    Number(modeling3dCost || 0) +
    Number(renderingCost || 0);

  // Calculate gross profit and margin
  const grossProfit = Number(salesPrice || 0) - totalCost;
  const grossProfitMargin = Number(salesPrice) ? (grossProfit / Number(salesPrice) * 100) : 0;

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
          <div className="grid grid-cols-1 gap-6">
            {/* Creative Director Hours and Internal Cost */}
            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Creative Director Hours (€{CREATIVE_DIRECTOR_RATE}/hour)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Hours"
                  value={creativeDirectorHours}
                  onChange={(e) => setCreativeDirectorHours(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{internalCost.toLocaleString()}
                </div>
              </div>
            </div>

            {/* External Cost */}
            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">External Cost</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="External Cost"
                  value={externalCost}
                  onChange={(e) => setExternalCost(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{Number(externalCost || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Software Cost</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Software Cost"
                  value={softwareCost}
                  onChange={(e) => setSoftwareCost(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{Number(softwareCost || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* New development costs */}
            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">VR Development Cost</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="VR Development Cost"
                  value={vrDevelopmentCost}
                  onChange={(e) => setVrDevelopmentCost(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{Number(vrDevelopmentCost || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Software Development Cost</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Software Development Cost"
                  value={softwareDevelopmentCost}
                  onChange={(e) => setSoftwareDevelopmentCost(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{Number(softwareDevelopmentCost || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Design Cost</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Design Cost"
                  value={designCost}
                  onChange={(e) => setDesignCost(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{Number(designCost || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">3D Modeling Cost</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="3D Modeling Cost"
                  value={modeling3dCost}
                  onChange={(e) => setModeling3dCost(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{Number(modeling3dCost || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rendering Cost</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Rendering Cost"
                  value={renderingCost}
                  onChange={(e) => setRenderingCost(e.target.value)}
                  className="flex-1"
                />
                <div className="text-sm font-semibold text-gray-900">
                  €{Number(renderingCost || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Expected Cost</label>
              <div className="text-lg font-bold text-gray-900">
                €{totalCost.toLocaleString()}
              </div>
            </div>

            {/* Profit Calculations */}
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Profit</label>
                  <div className={`text-lg font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{grossProfit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Profit Margin</label>
                  <div className={`text-lg font-bold ${grossProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {grossProfitMargin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          <XIcon className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'edit' ? (
            <>
              <SaveIcon className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Project
            </>
          )}
        </Button>
      </div>
    </form>
  );
};