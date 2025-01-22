import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, DollarSign, LineChart } from "lucide-react";

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

  // Get completed projects
  const completedProjects = projects.filter(project => project.status === 'completed');
  const completedSalesValue = completedProjects.reduce(
    (sum, project) => sum + Number(project.sales_price),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Potential Projects Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Pipeline Projects</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">€{potentialSalesValue.toLocaleString()}</div>
          <div className="flex items-center mt-2 text-sm text-purple-600">
            <LineChart className="h-4 w-4 mr-1" />
            {potentialProjects.length} projects in pipeline
          </div>
        </CardContent>
      </Card>

      {/* Active Projects Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Active Projects</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">€{activeSalesValue.toLocaleString()}</div>
          <div className="text-sm text-blue-600 mt-1">
            Paid: €{activePaidValue.toLocaleString()}
          </div>
          <div className="flex items-center mt-2 text-sm text-blue-600">
            <Activity className="h-4 w-4 mr-1" />
            {activeProjects.length} projects in progress
          </div>
        </CardContent>
      </Card>

      {/* Completed Projects Card */}
      <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Completed Projects</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">€{completedSalesValue.toLocaleString()}</div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <Activity className="h-4 w-4 mr-1" />
            {completedProjects.length} completed projects
          </div>
        </CardContent>
      </Card>
    </div>
  );
};