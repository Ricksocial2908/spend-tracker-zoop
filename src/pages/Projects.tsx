import { useState, useEffect } from "react";
import { ProjectList } from "@/components/ProjectList";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectForm } from "@/components/ProjectForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [totalInternalCost, setTotalInternalCost] = useState(0);
  const [totalExternalCost, setTotalExternalCost] = useState(0);
  const [totalSoftwareCost, setTotalSoftwareCost] = useState(0);
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          *,
          project_payments (
            amount,
            paid_amount
          )
        `);

      if (projectsError) throw projectsError;

      setProjects(projectsData || []);

      // Calculate totals
      if (projectsData) {
        setTotalInternalCost(
          projectsData.reduce((sum, project) => sum + Number(project.internal_cost), 0)
        );
        setTotalExternalCost(
          projectsData.reduce((sum, project) => sum + Number(project.external_cost), 0)
        );
        setTotalSoftwareCost(
          projectsData.reduce((sum, project) => sum + Number(project.software_cost), 0)
        );
        setTotalUnpaidAmount(
          projectsData.reduce((sum, project) => {
            const totalAmount = project.project_payments?.reduce(
              (pSum: number, payment: any) => pSum + Number(payment.amount),
              0
            ) || 0;
            const totalPaid = project.project_payments?.reduce(
              (pSum: number, payment: any) => pSum + Number(payment.paid_amount),
              0
            ) || 0;
            return sum + (totalAmount - totalPaid);
          }, 0)
        );
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = () => {
    setShowForm(false);
    fetchProjects();
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showForm && (
        <ProjectForm
          onProjectAdded={handleProjectAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProjectCard
          title="Total Internal Cost"
          amount={totalInternalCost}
          className="bg-blue-50"
        />
        <ProjectCard
          title="Total External Cost"
          amount={totalExternalCost}
          className="bg-green-50"
        />
        <ProjectCard
          title="Total Software Cost"
          amount={totalSoftwareCost}
          className="bg-purple-50"
        />
        <ProjectCard
          title="Total Unpaid Amount"
          amount={totalUnpaidAmount}
          className="bg-red-50"
        />
      </div>

      <ProjectList projects={projects} onProjectUpdated={fetchProjects} />
    </div>
  );
}