import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChefHat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffAuth } from "@/lib/staff-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Staff Sign In — Tehila Royal Kitchen" },
      {
        name: "description",
        content: "Sign in to the Tehila Royal Kitchen staff dashboard.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const { signIn, user, ready } = useStaffAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) void navigate({ to: "/admin", replace: true });
  }, [ready, user, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn(email, password);
    setBusy(false);
    if (res.error) setError(res.error);
    else void navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-admin-bg px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-admin-surface p-8 shadow-lift">
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ChefHat className="size-5" />
          </span>
          <span className="font-display text-xl">Tehila Royal Kitchen</span>
        </div>
        <h1 className="mt-6 text-2xl">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to see today's orders and payments.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@tehilaroyalkitchen.co.ke"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="h-11 w-full rounded-xl">
            {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New on the team?{" "}
          <Link to="/admin/signup" className="font-medium text-primary hover:underline">
            Create a staff account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Back to the shop
          </Link>
        </p>
      </div>
    </div>
  );
}
