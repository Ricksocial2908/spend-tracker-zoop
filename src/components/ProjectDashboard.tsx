import { ProjectOverviewCards } from "./ProjectOverviewCards";
import { ProjectStatusCards } from "./ProjectStatusCards";

interface Project {
  id: number;
  name: string;
  status: string;
  internal_cost: number;
  external_cost: number;
  software_cost: number;
  sales_price: number;
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

interface ProjectDashboardProps {
  projects: Project[];
}

export const ProjectDashboard = ({ projects }: ProjectDashboardProps) => {
  return (
    <div className="space-y-6">
      <ProjectOverviewCards projects={projects} />
      <ProjectStatusCards projects={projects} />
    </div>
  );
};