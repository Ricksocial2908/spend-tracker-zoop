import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ChartBar } from "lucide-react";
import { ProjectCard } from "./ProjectCard";

interface ProjectProfitAnalysisProps {
  project: {
    name: string;
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
  };
}

export const ProjectProfitAnalysis = ({ project }: ProjectProfitAnalysisProps) => {
  // Calculate total expected costs
  const totalExpectedCost = 
    Number(project.internal_cost) +
    Number(project.external_cost) +
    Number(project.software_cost) +
    Number(project.vr_development_cost) +
    Number(project.software_development_cost) +
    Number(project.design_cost) +
    Number(project.modeling_3d_cost) +
    Number(project.rendering_cost);

  // Calculate total paid amount
  const totalPaidAmount = project.project_payments?.reduce(
    (sum, payment) => sum + Number(payment.paid_amount),
    0
  ) || 0;

  // Calculate profits and margins
  const expectedGrossProfit = Number(project.sales_price) - totalExpectedCost;
  const actualGrossProfit = Number(project.sales_price) - totalPaidAmount;
  
  const expectedProfitMargin = Number(project.sales_price) 
    ? (expectedGrossProfit / Number(project.sales_price) * 100) 
    : 0;
  
  const actualProfitMargin = Number(project.sales_price)
    ? (actualGrossProfit / Number(project.sales_price) * 100)
    : 0;

  const profitMarginDifference = actualProfitMargin - expectedProfitMargin;
  const profitDifference = actualGrossProfit - expectedGrossProfit;

  const isProfit = actualGrossProfit > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            Profit Analysis: {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProjectCard
                title="Expected Cost"
                amount={totalExpectedCost}
                className="border-blue-100"
              />
              <ProjectCard
                title="Actual Cost (Paid)"
                amount={totalPaidAmount}
                className={`${
                  totalPaidAmount > totalExpectedCost
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }`}
              />
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Profit Margins</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expected</span>
                    <span className={`font-semibold ${expectedProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {expectedProfitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Actual</span>
                    <span className={`font-semibold ${actualProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {actualProfitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Difference</span>
                    <span className={`font-semibold ${profitMarginDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitMarginDifference.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Profit Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expected Profit</span>
                    <span className={`font-semibold ${expectedGrossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{expectedGrossProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Actual Profit</span>
                    <span className={`font-semibold ${actualGrossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{actualGrossProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Difference</span>
                    <span className={`font-semibold ${profitDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{profitDifference.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};