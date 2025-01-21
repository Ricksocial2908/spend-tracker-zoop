import { useState, useEffect } from "react";
import { ProjectList } from "@/components/ProjectList";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { ProjectForm } from "@/components/ProjectForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
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

      <ProjectDashboard projects={projects} />
      <ProjectList projects={projects} onProjectUpdated={fetchProjects} />
    </div>
  );
};