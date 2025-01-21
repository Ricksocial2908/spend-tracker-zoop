import { ProjectForm } from "./ProjectForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditProjectFormProps {
  project: {
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
  };
  open: boolean;
  onClose: () => void;
  onProjectUpdated: () => void;
}

export const EditProjectForm = ({ project, open, onClose, onProjectUpdated }: EditProjectFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project: {project.name}</DialogTitle>
        </DialogHeader>
        <ProjectForm
          initialData={project}
          onProjectAdded={onProjectUpdated}
          onCancel={onClose}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
};