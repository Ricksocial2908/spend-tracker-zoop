import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditProjectForm } from "./EditProjectForm";
import { ProjectProfitAnalysis } from "./ProjectProfitAnalysis";

interface Project {
  id: number;
  name: string;
  internal_cost: number;
  external_cost: number;
  software_cost: number;
  sales_price: number;
  status: string;
  project_code: string | null;
  client: string | null;
  project_type: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  billable_rate: number | null;
  notes: string | null;
  vr_development_cost: number;
  software_development_cost: number;
  design_cost: number;
  modeling_3d_cost: number;
  rendering_cost: number;
  project_payments: {
    amount: number;
    paid_amount: number;
  }[];
}

interface ProjectListProps {
  projects: Project[];
  onProjectUpdated: () => void;
}

type SortField = 'name' | 'total_cost' | 'sales_price' | 'remaining_cost';
type SortDirection = 'asc' | 'desc';

const getStatusColor = (status: string) => {
  const colors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    awaiting_po: "bg-purple-100 text-purple-800",
    nearing_completion: "bg-orange-100 text-orange-800",
    completed: "bg-blue-100 text-blue-800",
  } as const;
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const ProjectList = ({ projects, onProjectUpdated }: ProjectListProps) => {
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleRowClick = (projectId: number) => {
    setHighlightedIds(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const calculateTotalCost = (project: Project) => {
    return (
      Number(project.internal_cost) +
      Number(project.external_cost) +
      Number(project.software_cost) +
      Number(project.vr_development_cost) +
      Number(project.software_development_cost) +
      Number(project.design_cost) +
      Number(project.modeling_3d_cost) +
      Number(project.rendering_cost)
    );
  };

  const calculateTotalPaidAmount = (project: Project) => {
    return project.project_payments?.reduce((total, payment) => total + Number(payment.paid_amount), 0) || 0;
  };

  const calculateRemainingCost = (project: Project) => {
    const totalCost = calculateTotalCost(project);
    const totalPaid = calculateTotalPaidAmount(project);
    return totalCost - totalPaid;
  };

  const handleStatusChange = async (projectId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;
      
      onProjectUpdated();
      toast.success("Project status updated");
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleEditComplete = () => {
    setEditingProject(null);
    onProjectUpdated();
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return a.name.localeCompare(b.name) * multiplier;
      case 'total_cost':
        return (calculateTotalCost(a) - calculateTotalCost(b)) * multiplier;
      case 'sales_price':
        return (Number(a.sales_price) - Number(b.sales_price)) * multiplier;
      case 'remaining_cost':
        return (calculateRemainingCost(a) - calculateRemainingCost(b)) * multiplier;
      default:
        return 0;
    }
  });

  const SortButton = ({ field, label }: { field: SortField, label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="hover:bg-muted/30"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      {editingProject && (
        <EditProjectForm
          project={editingProject}
          open={true}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={handleEditComplete}
        />
      )}
      
      {selectedProject && (
        <ProjectProfitAnalysis project={selectedProject} />
      )}

      <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="name" label="Project Name" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortButton field="total_cost" label="Total Cost" />
              </TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>
                <SortButton field="remaining_cost" label="Remaining Cost" />
              </TableHead>
              <TableHead>
                <SortButton field="sales_price" label="Sales Price" />
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => (
              <TableRow 
                key={project.id}
                onClick={() => {
                  handleRowClick(project.id);
                  setSelectedProject(selectedProject?.id === project.id ? null : project);
                }}
                className={`cursor-pointer transition-colors ${
                  highlightedIds.includes(project.id) ? "bg-blue-200 hover:bg-blue-300" : "hover:bg-muted/50"
                }`}
              >
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={project.status}
                      onValueChange={(value) => handleStatusChange(project.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {['active', 'pending', 'awaiting_po', 'nearing_completion', 'completed'].map((status) => (
                          <SelectItem key={status} value={status}>
                            <Badge className={getStatusColor(status)}>
                              {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>€{calculateTotalCost(project).toLocaleString()}</TableCell>
                <TableCell>€{calculateTotalPaidAmount(project).toLocaleString()}</TableCell>
                <TableCell>€{calculateRemainingCost(project).toLocaleString()}</TableCell>
                <TableCell>€{Number(project.sales_price).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(project)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
