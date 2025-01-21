import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: number;
  name: string;
  status: string;
  internal_cost: number;
  external_cost: number;
  software_cost: number;
  sales_price: number;
  project_payments: {
    amount: number;
    paid_amount: number;
  }[];
}

interface ProjectDashboardProps {
  projects: Project[];
}

export const ProjectDashboard = ({ projects }: ProjectDashboardProps) => {
  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  const calculateTotalCost = (project: Project) => {
    return Number(project.internal_cost) + Number(project.external_cost) + Number(project.software_cost);
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

  const statuses = ['active', 'pending', 'awaiting_po', 'completed'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statuses.map((status) => (
        <Card key={status} className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="capitalize">{status.replace('_', ' ')}</span>
              <Badge variant={
                status === 'active' ? 'default' :
                status === 'pending' ? 'secondary' :
                status === 'awaiting_po' ? 'warning' :
                'success'
              }>
                {getProjectsByStatus(status).length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getProjectsByStatus(status).map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-lg border bg-white/50 space-y-2"
              >
                <h3 className="font-medium">{project.name}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span>€{calculateTotalCost(project).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Price:</span>
                    <span>€{Number(project.sales_price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Outstanding:</span>
                    <span>€{calculateUnpaidAmount(project).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {getProjectsByStatus(status).length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No projects
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};