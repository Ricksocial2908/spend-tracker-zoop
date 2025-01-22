import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, AlertCircle, CheckCircle2, HourglassIcon } from "lucide-react";

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

interface ProjectStatusCardsProps {
  projects: Project[];
}

export const ProjectStatusCards = ({ projects }: ProjectStatusCardsProps) => {
  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  const calculateTotalCost = (project: Project) => {
    return (
      Number(project.internal_cost) +
      Number(project.external_cost) +
      Number(project.software_cost)
    );
  };

  const calculateTotalPaid = (project: Project) => {
    return project.project_payments.reduce((sum, payment) => sum + Number(payment.paid_amount), 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'awaiting_po':
        return <HourglassIcon className="h-4 w-4 text-purple-500" />;
      case 'nearing_completion':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-teal-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'awaiting_po':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'nearing_completion':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statuses = ['active', 'pending', 'awaiting_po', 'nearing_completion', 'completed'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {statuses.map((status) => (
        <Card key={status} className={`bg-white/80 backdrop-blur-sm border ${getStatusColor(status)}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(status)}
                <span className="capitalize">{status.replace('_', ' ')}</span>
              </div>
              <Badge variant="outline" className={getStatusColor(status)}>
                {getProjectsByStatus(status).length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getProjectsByStatus(status).map((project) => (
              <div
                key={project.id}
                className="p-3 rounded-lg border bg-white/90 space-y-2 hover:shadow-sm transition-shadow"
              >
                <h3 className="font-medium text-sm">{project.name}</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span>€{calculateTotalCost(project).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales:</span>
                    <span>€{Number(project.sales_price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Paid:</span>
                    <span>€{calculateTotalPaid(project).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {getProjectsByStatus(status).length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-3">
                No projects
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};