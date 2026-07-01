import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  return (
    <div>
      <PageHeader title="User Management" description="Manage students, plans, and access." />
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Admin user-management endpoints are not yet exposed by the backend.
      </Card>
    </div>
  );
}