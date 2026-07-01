import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/voice")({
  component: VoicePage,
});

function VoicePage() {
  return (
    <div>
      <PageHeader title="Voice Assistant" description="Hands-free learning. Speak naturally, learn instantly." />
      <Card className="p-10 text-center glass">
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40 rounded-full grid place-items-center text-white gradient-primary-bg opacity-60 shadow-glow">
            <Mic className="h-16 w-16" />
          </div>
          <div className="mt-6 text-lg font-semibold">Voice Assistant coming soon</div>
          <div className="text-sm text-muted-foreground mt-1">
            Speech-to-text is not yet supported by the backend.
          </div>
        </div>
      </Card>
    </div>
  );
}