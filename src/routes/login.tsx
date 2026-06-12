import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión · Agenda IA" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">Agenda IA</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">Accedé a tu panel o probá la demo.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/app" }); }}
          >
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button type="submit" className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Ingresar
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">o</span></div>
          </div>

          <Link to="/app" className="flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent">
            Acceso Demo <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Entrá sin registrarte y explorá con datos de ejemplo.</p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
}
