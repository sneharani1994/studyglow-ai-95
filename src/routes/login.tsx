import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginWithCredentials } from "@/lib/auth";
import { authService } from "@/lib/api";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — StudyGPT" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      await loginWithCredentials(email, password);
      navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    window.location.href = authService.oauthUrl(provider);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning journey."
      footer={<>Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" /> <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary-bg text-white border-0 hover:opacity-90">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <div className="flex items-center gap-3 my-2">
          <Separator className="flex-1" /><span className="text-xs text-muted-foreground">OR</span><Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" onClick={() => handleOAuth("google")}>Google</Button>
          <Button variant="outline" type="button" onClick={() => handleOAuth("github")}>GitHub</Button>
        </div>
      </form>
    </AuthLayout>
  );
}