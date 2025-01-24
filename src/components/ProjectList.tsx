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
}

interface ProjectListProps {
  projects: Project[];
  onProjectUpdated: () => void;
}

export const ProjectList = ({ projects, onProjectUpdated }: ProjectListProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  {!project.is_draft && (
                    <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      Live
                    </span>
                  )}
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
            <div className="space-y-2 text-sm text-gray-600">
              {project.project_code && (
                <p>Code: {project.project_code}</p>
              )}
              {project.client && (
                <p>Client: {project.client}</p>
              )}
              <p>Sales Price: €{project.sales_price.toLocaleString()}</p>
              <p>Total Cost: €{(
                project.internal_cost +
                project.external_cost +
                project.software_cost +
                project.vr_development_cost +
                project.software_development_cost +
                project.design_cost +
                project.modeling_3d_cost +
                project.rendering_cost
              ).toLocaleString()}</p>
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