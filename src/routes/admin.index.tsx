import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

function AdminOverview() {
  return (
    <div>
      <PageHeader title="Overview" description="Platform health at a glance." />
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Platform-wide admin metrics are not yet exposed by the backend.
      </Card>
    </div>
  );
}