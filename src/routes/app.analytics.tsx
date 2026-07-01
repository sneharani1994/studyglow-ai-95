import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dashboardService, quizzesService, type DashboardStats, type QuizAttempt } from "@/lib/api";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([dashboardService.get(), quizzesService.attempts()]).then(([d, a]) => {
      if (d.status === "fulfilled") setData(d.value);
      if (a.status === "fulfilled") setAttempts(a.value);
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Study streak", value: `${data?.profile.studyStreak ?? 0} days`, sub: "🔥 keep going" },
    { label: "Study hours", value: `${data?.profile.totalStudyHours ?? 0}`, sub: "total logged" },
    { label: "Quizzes taken", value: `${data?.quizStatistics.totalAttempts ?? 0}`, sub: "attempts" },
    { label: "Accuracy", value: `${data?.quizStatistics.averageScorePercentage ?? 0}%`, sub: "across quizzes" },
  ];

  const scoreBySubject = (() => {
    const map = new Map<string, { total: number; scored: number }>();
    for (const a of attempts) {
      const name = a.quizzes?.subjects?.name ?? a.quizzes?.title ?? "General";
      const prev = map.get(name) ?? { total: 0, scored: 0 };
      prev.total += a.total_questions || 0;
      prev.scored += a.score || 0;
      map.set(name, prev);
    }
    return Array.from(map.entries()).map(([name, v]) => ({
      name, score: v.total ? Math.round((v.scored / v.total) * 100) : 0,
    }));
  })();

  return (
    <div>
      <PageHeader title="Analytics" description="The numbers behind your progress." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          : cards.map((c) => (
              <Card key={c.label} className="p-5">
                <div className="text-xs text-muted-foreground">{c.label}</div>
                <div className="text-3xl font-bold gradient-text mt-2">{c.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.sub}</div>
              </Card>
            ))}
      </div>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quiz scores by subject</h3>
        {loading ? (
          <Skeleton className="h-60 w-full" />
        ) : scoreBySubject.length === 0 ? (
          <div className="text-sm text-muted-foreground p-8 text-center">No quiz history yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreBySubject}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}