import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/admin/analytics")({ component: AdminAnalytics });

function AdminAnalytics() {
  return (
    <div>
      <PageHeader title="Analytics" description="Platform engagement and learning outcomes." />
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Admin analytics endpoints are not yet exposed by the backend.
      </Card>
    </div>
  );
}