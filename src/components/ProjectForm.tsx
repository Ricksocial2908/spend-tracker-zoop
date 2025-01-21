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
    status?: string;
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

  const [internalPaidHours, setInternalPaidHours] = useState("0");
  const [externalPaidAmount, setExternalPaidAmount] = useState("0");
  const [softwarePaidAmount, setSoftwarePaidAmount] = useState("0");
  const [vrDevelopmentPaidAmount, setVrDevelopmentPaidAmount] = useState("0");
  const [softwareDevelopmentPaidAmount, setSoftwareDevelopmentPaidAmount] = useState("0");
  const [designPaidAmount, setDesignPaidAmount] = useState("0");
  const [modeling3dPaidAmount, setModeling3dPaidAmount] = useState("0");
  const [renderingPaidAmount, setRenderingPaidAmount] = useState("0");

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
        status: initialData?.status || 'pending'
      };

      let result;
      
      if (mode === 'edit' && initialData?.id) {
        result = await supabase
          .from("projects")
          .update(projectData)
          .eq('id', initialData.id)
          .select();

        if (result.error) throw result.error;
        
        // Create or update project payment record
        const paymentData = {
          project_id: initialData.id,
          amount: totalCost,
          paid_amount: totalPaidAmount,
          payment_date: new Date().toISOString().split('T')[0],
          payment_type: 'contractor',
          invoice_reference: `INV-${initialData.id}-${new Date().getTime()}`
        };

        const { data: existingPayment } = await supabase
          .from('project_payments')
          .select()
          .eq('project_id', initialData.id)
          .maybeSingle();

        if (existingPayment) {
          const { error: paymentError } = await supabase
            .from('project_payments')
            .update(paymentData)
            .eq('id', existingPayment.id);

          if (paymentError) throw paymentError;
        } else {
          const { error: paymentError } = await supabase
            .from('project_payments')
            .insert(paymentData);

          if (paymentError) throw paymentError;
        }

        toast.success("Project updated successfully");
      } else {
        result = await supabase
          .from("projects")
          .insert(projectData)
          .select();

        if (result.error) throw result.error;

        if (result.data && result.data[0]) {
          const paymentData = {
            project_id: result.data[0].id,
            amount: totalCost,
            paid_amount: totalPaidAmount,
            payment_date: new Date().toISOString().split('T')[0],
            payment_type: 'contractor',
            invoice_reference: `INV-${result.data[0].id}-${new Date().getTime()}`
          };

          const { error: paymentError } = await supabase
            .from('project_payments')
            .insert(paymentData);

          if (paymentError) throw paymentError;
        }

        toast.success("Project added successfully");
      }

      onProjectAdded();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} project`);
    }
  };

  const totalCost = internalCost + 
    Number(externalCost || 0) + 
    Number(softwareCost || 0) +
    Number(vrDevelopmentCost || 0) +
    Number(softwareDevelopmentCost || 0) +
    Number(designCost || 0) +
    Number(modeling3dCost || 0) +
    Number(renderingCost || 0);

  const totalPaidAmount = 
    Number(internalPaidHours || 0) * CREATIVE_DIRECTOR_RATE +
    Number(externalPaidAmount || 0) +
    Number(softwarePaidAmount || 0) +
    Number(vrDevelopmentPaidAmount || 0) +
    Number(softwareDevelopmentPaidAmount || 0) +
    Number(designPaidAmount || 0) +
    Number(modeling3dPaidAmount || 0) +
    Number(renderingPaidAmount || 0);

  const grossProfit = Number(salesPrice || 0) - totalPaidAmount;
  const grossProfitMargin = Number(salesPrice) ? (grossProfit / Number(salesPrice) * 100) : 0;

  const expectedGrossProfit = Number(salesPrice || 0) - totalCost;
  const expectedGrossProfitMargin = Number(salesPrice) ? (expectedGrossProfit / Number(salesPrice) * 100) : 0;

  const profitMarginDifference = grossProfitMargin - expectedGrossProfitMargin;
  const profitDifference = grossProfit - expectedGrossProfit;

  const isOverBudget = (cost: number, paid: number) => paid > cost;

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
            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Creative Director Hours (€{CREATIVE_DIRECTOR_RATE}/hour)</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Hours"
                    value={creativeDirectorHours}
                    onChange={(e) => setCreativeDirectorHours(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{internalCost.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Hours"
                    value={internalPaidHours}
                    onChange={(e) => setInternalPaidHours(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(internalCost, Number(internalPaidHours) * CREATIVE_DIRECTOR_RATE) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{(Number(internalPaidHours) * CREATIVE_DIRECTOR_RATE).toLocaleString()} ({Number(internalPaidHours)} hrs)
                    </div>
                    {isOverBudget(internalCost, Number(internalPaidHours) * CREATIVE_DIRECTOR_RATE) && (
                      <div className="truncate">
                        Exceeded by €{((Number(internalPaidHours) * CREATIVE_DIRECTOR_RATE) - internalCost).toLocaleString()} / {(Number(internalPaidHours) - Number(creativeDirectorHours)).toFixed(1)}hrs
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">External Cost</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="External Cost"
                    value={externalCost}
                    onChange={(e) => setExternalCost(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{Number(externalCost || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Amount"
                    value={externalPaidAmount}
                    onChange={(e) => setExternalPaidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(Number(externalCost), Number(externalPaidAmount)) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{Number(externalPaidAmount).toLocaleString()}
                    </div>
                    {isOverBudget(Number(externalCost), Number(externalPaidAmount)) && (
                      <div className="truncate">
                        Exceeded by €{(Number(externalPaidAmount) - Number(externalCost)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Software Cost</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Software Cost"
                    value={softwareCost}
                    onChange={(e) => setSoftwareCost(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{Number(softwareCost || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Amount"
                    value={softwarePaidAmount}
                    onChange={(e) => setSoftwarePaidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(Number(softwareCost), Number(softwarePaidAmount)) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{Number(softwarePaidAmount).toLocaleString()}
                    </div>
                    {isOverBudget(Number(softwareCost), Number(softwarePaidAmount)) && (
                      <div className="truncate">
                        Exceeded by €{(Number(softwarePaidAmount) - Number(softwareCost)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">VR Development Cost</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="VR Development Cost"
                    value={vrDevelopmentCost}
                    onChange={(e) => setVrDevelopmentCost(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{Number(vrDevelopmentCost || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Amount"
                    value={vrDevelopmentPaidAmount}
                    onChange={(e) => setVrDevelopmentPaidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(Number(vrDevelopmentCost), Number(vrDevelopmentPaidAmount)) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{Number(vrDevelopmentPaidAmount).toLocaleString()}
                    </div>
                    {isOverBudget(Number(vrDevelopmentCost), Number(vrDevelopmentPaidAmount)) && (
                      <div className="truncate">
                        Exceeded by €{(Number(vrDevelopmentPaidAmount) - Number(vrDevelopmentCost)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Software Development Cost</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Software Development Cost"
                    value={softwareDevelopmentCost}
                    onChange={(e) => setSoftwareDevelopmentCost(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{Number(softwareDevelopmentCost || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Amount"
                    value={softwareDevelopmentPaidAmount}
                    onChange={(e) => setSoftwareDevelopmentPaidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(Number(softwareDevelopmentCost), Number(softwareDevelopmentPaidAmount)) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{Number(softwareDevelopmentPaidAmount).toLocaleString()}
                    </div>
                    {isOverBudget(Number(softwareDevelopmentCost), Number(softwareDevelopmentPaidAmount)) && (
                      <div className="truncate">
                        Exceeded by €{(Number(softwareDevelopmentPaidAmount) - Number(softwareDevelopmentCost)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Design Cost</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Design Cost"
                    value={designCost}
                    onChange={(e) => setDesignCost(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{Number(designCost || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Amount"
                    value={designPaidAmount}
                    onChange={(e) => setDesignPaidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(Number(designCost), Number(designPaidAmount)) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{Number(designPaidAmount).toLocaleString()}
                    </div>
                    {isOverBudget(Number(designCost), Number(designPaidAmount)) && (
                      <div className="truncate">
                        Exceeded by €{(Number(designPaidAmount) - Number(designCost)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">3D Modeling Cost</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="3D Modeling Cost"
                    value={modeling3dCost}
                    onChange={(e) => setModeling3dCost(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{Number(modeling3dCost || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Amount"
                    value={modeling3dPaidAmount}
                    onChange={(e) => setModeling3dPaidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(Number(modeling3dCost), Number(modeling3dPaidAmount)) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{Number(modeling3dPaidAmount).toLocaleString()}
                    </div>
                    {isOverBudget(Number(modeling3dCost), Number(modeling3dPaidAmount)) && (
                      <div className="truncate">
                        Exceeded by €{(Number(modeling3dPaidAmount) - Number(modeling3dCost)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rendering Cost</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Rendering Cost"
                    value={renderingCost}
                    onChange={(e) => setRenderingCost(e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-xs font-semibold text-gray-900 min-w-[80px] text-right">
                    €{Number(renderingCost || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Paid Amount"
                    value={renderingPaidAmount}
                    onChange={(e) => setRenderingPaidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <div className={`text-xs font-semibold break-words ${isOverBudget(Number(renderingCost), Number(renderingPaidAmount)) ? 'text-red-600' : 'text-gray-900'} min-w-[80px] text-right`}>
                    <div className="truncate">
                      Paid: €{Number(renderingPaidAmount).toLocaleString()}
                    </div>
                    {isOverBudget(Number(renderingCost), Number(renderingPaidAmount)) && (
                      <div className="truncate">
                        Exceeded by €{(Number(renderingPaidAmount) - Number(renderingCost)).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Expected Cost</label>
              <div className="text-sm font-bold text-gray-900">
                €{totalCost.toLocaleString()}
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Paid Amount</label>
              <div className={`text-sm font-bold break-words ${totalPaidAmount > totalCost ? 'text-red-600' : 'text-gray-900'}`}>
                <div className="truncate">
                  €{totalPaidAmount.toLocaleString()}
                </div>
                {totalPaidAmount > totalCost && (
                  <div className="truncate">
                    Exceeded by €{(totalPaidAmount - totalCost).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-green-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Profit (Based on Paid Amount)</label>
                  <div className={`text-sm font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{grossProfit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Profit Margin</label>
                  <div className={`text-sm font-bold ${grossProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {grossProfitMargin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Gross Profit (Based on Expected Costs)</label>
                  <div className={`text-sm font-bold ${(Number(salesPrice) - totalCost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{(Number(salesPrice) - totalCost).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Gross Profit Margin</label>
                  <div className={`text-sm font-bold ${(Number(salesPrice) - totalCost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(salesPrice) ? (((Number(salesPrice) - totalCost) / Number(salesPrice)) * 100).toFixed(1) : '0'}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-4 border rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margin Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Profit Margins (Based on Costs)</label>
                <div className={`text-sm font-bold ${expectedGrossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <div>Gross Profit: €{expectedGrossProfit.toLocaleString()}</div>
                  <div>Margin: {expectedGrossProfitMargin.toFixed(1)}%</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actual Profit Margins (Based on Paid)</label>
                <div className={`text-sm font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <div>Gross Profit: €{grossProfit.toLocaleString()}</div>
                  <div>Margin: {grossProfitMargin.toFixed(1)}%</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profit Difference Analysis</label>
                <div className={`text-sm font-bold ${profitDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <div>Profit Difference: €{profitDifference.toLocaleString()}</div>
                  <div>Margin Difference: {profitMarginDifference.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {profitDifference >= 0 
                      ? "Actual profit is higher than expected" 
                      : "Actual profit is lower than expected"}
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