import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ChartBar, CreditCard, Database, TrendingUp, Activity } from "lucide-react";

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
  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
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

  // Get potential projects (pending and awaiting_po)
  const potentialProjects = projects.filter(project => 
    ['pending', 'awaiting_po'].includes(project.status)
  );
  const potentialSalesValue = potentialProjects.reduce(
    (sum, project) => sum + Number(project.sales_price), 
    0
  );

  // Get active projects
  const activeProjects = projects.filter(project => project.status === 'active');
  const activeSalesValue = activeProjects.reduce(
    (sum, project) => sum + Number(project.sales_price), 
    0
  );

  // Calculate total unpaid costs (now including project costs and payment amounts)
  const totalUnpaidCosts = projects.reduce((sum, project) => {
    const totalCost = calculateTotalCost(project);
    const unpaidPayments = calculateUnpaidAmount(project);
    return sum + totalCost + unpaidPayments;
  }, 0);

  const statuses = ['active', 'pending', 'awaiting_po', 'nearing_completion', 'completed'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Potential Projects Card */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{potentialSalesValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {potentialProjects.length} projects in pipeline
            </p>
          </CardContent>
        </Card>

        {/* Active Projects Card */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{activeSalesValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects.length} projects in progress
            </p>
          </CardContent>
        </Card>

        {/* Total Unpaid Costs Card */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unpaid Costs</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalUnpaidCosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding payments and costs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((status) => (
          <Card key={status} className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <Badge variant={
                  status === 'active' ? 'default' :
                  status === 'pending' ? 'secondary' :
                  status === 'awaiting_po' ? 'outline' :
                  status === 'nearing_completion' ? 'outline' :
                  'secondary'
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
    </div>
  );
};