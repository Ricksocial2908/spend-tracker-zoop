import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon, ArrowUpDown, PlusIcon } from "lucide-react";
import { useState } from "react";
import { ProjectPaymentForm } from "./ProjectPaymentForm";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  name: string;
  internal_cost: number;
  external_cost: number;
  software_cost: number;
  internal_cost_category: string;
  external_cost_category: string;
  software_cost_category: string;
  project_payments: {
    amount: number;
    paid_amount: number;
  }[];
}

interface ProjectListProps {
  projects: Project[];
  onProjectUpdated: () => void;
}

type SortField = 'name' | 'internal_cost' | 'external_cost' | 'software_cost' | 'unpaid';
type SortDirection = 'asc' | 'desc';

const getCategoryColor = (category: string) => {
  const colors = {
    internal: "bg-blue-100 text-blue-800",
    contractor: "bg-purple-100 text-purple-800",
    services: "bg-green-100 text-green-800",
    software: "bg-yellow-100 text-yellow-800",
    stock: "bg-pink-100 text-pink-800",
  } as const;
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const ProjectList = ({ projects, onProjectUpdated }: ProjectListProps) => {
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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

  const calculateUnpaidAmount = (project: Project) => {
    const totalAmount = project.project_payments?.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    ) || 0;
    const totalPaid = project.project_payments?.reduce(
      (sum, payment) => sum + Number(payment.paid_amount),
      0
    ) || 0;
    return totalAmount - totalPaid;
  };

  const handleAddPayment = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowPaymentForm(true);
  };

  const handlePaymentAdded = () => {
    setShowPaymentForm(false);
    setSelectedProjectId(null);
    onProjectUpdated();
  };

  const calculateTotalPaid = (project: Project) => {
    return project.project_payments?.reduce(
      (sum, payment) => sum + Number(payment.paid_amount),
      0
    ) || 0;
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return a.name.localeCompare(b.name) * multiplier;
      case 'internal_cost':
        return (Number(a.internal_cost) - Number(b.internal_cost)) * multiplier;
      case 'external_cost':
        return (Number(a.external_cost) - Number(b.external_cost)) * multiplier;
      case 'software_cost':
        return (Number(a.software_cost) - Number(b.software_cost)) * multiplier;
      case 'unpaid':
        return (calculateUnpaidAmount(a) - calculateUnpaidAmount(b)) * multiplier;
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
      {showPaymentForm && selectedProjectId && (
        <ProjectPaymentForm
          projectId={selectedProjectId}
          onPaymentAdded={handlePaymentAdded}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedProjectId(null);
          }}
        />
      )}
      
      <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="name" label="Project Name" />
              </TableHead>
              <TableHead>
                <SortButton field="internal_cost" label="Internal Cost" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <SortButton field="external_cost" label="External Cost" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <SortButton field="software_cost" label="Software Cost" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>
                <SortButton field="unpaid" label="Unpaid Amount" />
              </TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => (
              <TableRow 
                key={project.id}
                onClick={() => handleRowClick(project.id)}
                className={`cursor-pointer transition-colors ${
                  highlightedIds.includes(project.id) ? "bg-blue-200 hover:bg-blue-300" : "hover:bg-muted/50"
                }`}
              >
                <TableCell>{project.name}</TableCell>
                <TableCell>€{Number(project.internal_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(project.internal_cost_category)}>
                    {project.internal_cost_category.charAt(0).toUpperCase() + project.internal_cost_category.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>€{Number(project.external_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(project.external_cost_category)}>
                    {project.external_cost_category.charAt(0).toUpperCase() + project.external_cost_category.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>€{Number(project.software_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(project.software_cost_category)}>
                    {project.software_cost_category.charAt(0).toUpperCase() + project.software_cost_category.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>€{calculateTotalPaid(project).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>€{calculateUnpaidAmount(project).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Handle edit
                      }}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPayment(project.id)}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Payments
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
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