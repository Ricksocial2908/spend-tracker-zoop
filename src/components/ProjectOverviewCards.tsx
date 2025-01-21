import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity } from "lucide-react";

interface Project {
  id: number;
  status: string;
  sales_price: number;
  project_payments: {
    amount: number;
    paid_amount: number;
  }[];
}

interface ProjectOverviewCardsProps {
  projects: Project[];
}

export const ProjectOverviewCards = ({ projects }: ProjectOverviewCardsProps) => {
  const calculateTotalPaid = (project: Project) => {
    return project.project_payments.reduce((sum, payment) => sum + Number(payment.paid_amount), 0);
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

  const activePaidValue = activeProjects.reduce(
    (sum, project) => sum + calculateTotalPaid(project),
    0
  );

  return (
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
          <div className="text-sm text-muted-foreground">
            Paid: €{activePaidValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeProjects.length} projects in progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
};