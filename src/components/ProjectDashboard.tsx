import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ChartBar, CreditCard, Database, TrendingUp } from "lucide-react";

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

  const totalPotentialSales = projects.reduce((sum, project) => sum + Number(project.sales_price), 0);
  const confirmedSales = projects
    .filter(project => project.status === 'active' || project.status === 'completed')
    .reduce((sum, project) => sum + Number(project.sales_price), 0);
  
  const totalSalesValue = projects.reduce((sum, project) => sum + Number(project.sales_price), 0);
  const totalUnpaidCosts = projects.reduce((sum, project) => sum + calculateUnpaidAmount(project), 0);
  const totalUnpaid = projects.reduce((sum, project) => sum + calculateUnpaidAmount(project), 0);
  const grossProfit = totalSalesValue - totalUnpaidCosts;
  const grossMargin = totalSalesValue ? (grossProfit / totalSalesValue) * 100 : 0;

  const statuses = ['active', 'pending', 'awaiting_po', 'completed'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* New Sales Overview Card */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Overview</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{confirmedSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Potential: €{totalPotentialSales.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Existing Financial Overview Cards */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalSalesValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Gross Margin: {grossMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Costs</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalUnpaidCosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Gross Profit: €{grossProfit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalUnpaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding payments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all statuses
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
