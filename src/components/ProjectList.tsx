import { useState } from "react";
import { EditProjectForm } from "./EditProjectForm";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";

interface Project {
  id: number;
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
  is_draft: boolean;
  status: 'pending' | 'active' | 'completed' | 'on_hold' | 'cancelled';
}

interface ProjectListProps {
  projects: Project[];
  onProjectUpdated: () => void;
}

export const ProjectList = ({ projects, onProjectUpdated }: ProjectListProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      pending: 'text-yellow-700 bg-yellow-100',
      active: 'text-green-700 bg-green-100',
      completed: 'text-blue-700 bg-blue-100',
      on_hold: 'text-orange-700 bg-orange-100',
      cancelled: 'text-red-700 bg-red-100'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <div className="flex gap-2">
                  {project.is_draft && (
                    <span className="inline-block px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                      Draft
                    </span>
                  )}
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingProject(project)}
              >
                <EditIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Project Details</p>
                {project.project_code && (
                  <p className="text-sm text-gray-600">Code: {project.project_code}</p>
                )}
                {project.client && (
                  <p className="text-sm text-gray-600">Client: {project.client}</p>
                )}
                {project.project_type && (
                  <p className="text-sm text-gray-600">Type: {project.project_type}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Dates</p>
                {project.start_date && (
                  <p className="text-sm text-gray-600">Start: {new Date(project.start_date).toLocaleDateString()}</p>
                )}
                {project.end_date && (
                  <p className="text-sm text-gray-600">End: {new Date(project.end_date).toLocaleDateString()}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Financial Overview</p>
                <p className="text-sm text-gray-600">Sales Price: €{project.sales_price.toLocaleString()}</p>
                {project.budget && (
                  <p className="text-sm text-gray-600">Budget: €{project.budget.toLocaleString()}</p>
                )}
                {project.billable_rate && (
                  <p className="text-sm text-gray-600">Rate: €{project.billable_rate.toLocaleString()}/hr</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Costs Breakdown</p>
                <p className="text-sm text-gray-600">Internal: €{project.internal_cost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">External: €{project.external_cost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Software: €{project.software_cost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <EditProjectForm
          project={editingProject}
          open={!!editingProject}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={onProjectUpdated}
        />
      )}
    </div>
  );
};