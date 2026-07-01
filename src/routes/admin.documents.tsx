import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/admin/documents")({ component: AdminDocs });

function AdminDocs() {
  return (
    <div>
      <PageHeader title="Document Management" description="All documents uploaded across the platform." />
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Cross-user document listing is not yet exposed by the backend.
      </Card>
    </div>
  );
}