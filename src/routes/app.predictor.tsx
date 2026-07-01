import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/predictor")({
  component: PredictorPage,
});

function PredictorPage() {
  return (
    <div>
      <PageHeader title="AI Exam Predictor" description="Likely exam questions ranked by historical probability." />
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Exam predictor is coming soon — no backend endpoint yet.
      </Card>
    </div>
  );
}