import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signupWithCredentials } from "@/lib/auth";
import { authService } from "@/lib/api";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — StudyGPT" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    setError(null);
    try {
      await signupWithCredentials(name, email, password);
      navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    window.location.href = authService.oauthUrl(provider);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever. No credit card required."
      footer={<>Already a member? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          <p className="text-xs text-muted-foreground">Use 8+ characters with a mix of letters & numbers.</p>
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary-bg text-white border-0 hover:opacity-90">
          {loading ? "Creating…" : "Create account"}
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