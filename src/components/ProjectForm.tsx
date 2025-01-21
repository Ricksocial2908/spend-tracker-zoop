import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFormProps {
  onProjectAdded: () => void;
  onCancel?: () => void;
}

const CATEGORIES = ['internal', 'contractor', 'services', 'software', 'stock'] as const;

export const ProjectForm = ({ onProjectAdded, onCancel }: ProjectFormProps) => {
  const [name, setName] = useState("");
  const [internalCost, setInternalCost] = useState("");
  const [externalCost, setExternalCost] = useState("");
  const [softwareCost, setSoftwareCost] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("internal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a project name");
      return;
    }

    try {
      const { error } = await supabase
        .from("projects")
        .insert({
          name,
          internal_cost: Number(internalCost) || 0,
          external_cost: Number(externalCost) || 0,
          software_cost: Number(softwareCost) || 0,
          category,
        });

      if (error) throw error;

      setName("");
      setInternalCost("");
      setExternalCost("");
      setSoftwareCost("");
      setCategory("internal");
      
      onProjectAdded();
      toast.success("Project added successfully");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Project</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Select
          value={category}
          onValueChange={(value: typeof CATEGORIES[number]) => setCategory(value)}
        >
          <SelectTrigger className="bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Internal Cost"
          value={internalCost}
          onChange={(e) => setInternalCost(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Input
          type="number"
          placeholder="External Cost"
          value={externalCost}
          onChange={(e) => setExternalCost(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
        <Input
          type="number"
          placeholder="Software Cost"
          value={softwareCost}
          onChange={(e) => setSoftwareCost(e.target.value)}
          className="bg-white/80 backdrop-blur-sm"
        />
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