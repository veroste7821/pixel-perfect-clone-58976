import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCheck2, Clock, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard · Agenda IA" }] }),
  component: Dashboard,
});

function today() { return new Date().toISOString().slice(0, 10); }

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const t = today();
      const [hoy, proximos, clientes, completados] = await Promise.all([
        supabase.from("turnos").select("*, clientes(nombre), servicios(nombre,precio,duracion_min)").eq("fecha", t).order("hora"),
        supabase.from("turnos").select("*, clientes(nombre), servicios(nombre)").gt("fecha", t).order("fecha").order("hora").limit(5),
        supabase.from("clientes").select("id", { count: "exact", head: true }),
        supabase.from("turnos").select("servicios(precio)").eq("fecha", t).in("estado", ["confirmado","completado"]),
      ]);
      const ingresos = (completados.data ?? []).reduce((acc: number, r: any) => acc + Number(r.servicios?.precio ?? 0), 0);
      return {
        hoy: hoy.data ?? [],
        proximos: proximos.data ?? [],
        clientesCount: clientes.count ?? 0,
        ingresos,
      };
    },
  });

  const turnosHoy = stats?.hoy ?? [];
  const ocupacion = Math.min(100, Math.round((turnosHoy.length / 12) * 100));

  const kpis = [
    { label: "Turnos hoy", value: String(turnosHoy.length).padStart(2, "0"), icon: CalendarCheck2, hint: "agendados" },
    { label: "Ocupación", value: `${ocupacion}%`, icon: Clock, hint: "sobre 12 slots" },
    { label: "Clientes", value: String(stats?.clientesCount ?? 0).padStart(2, "0"), icon: Users, hint: "en tu base" },
    { label: "Ingresos hoy", value: `$ ${(stats?.ingresos ?? 0).toLocaleString("es-AR")}`, icon: TrendingUp, hint: "estimado" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Buen día 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Esto es lo que pasa en tu agenda hoy.</p>
        </div>
        <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* Today + Upcoming */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Turnos de hoy</h2>
            <a href="/app/agenda" className="text-xs font-medium text-primary hover:underline">Ver agenda →</a>
          </div>
          {turnosHoy.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No hay turnos para hoy.</p>
          ) : (
            <ul className="divide-y divide-border">
              {turnosHoy.map((t: any) => (
                <li key={t.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="w-16 text-sm font-semibold tabular-nums">{t.hora.slice(0,5)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.clientes?.nombre}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.servicios?.nombre} · {t.servicios?.duracion_min} min</p>
                  </div>
                  <EstadoBadge estado={t.estado} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Próximos turnos</h2>
          </div>
          {(stats?.proximos ?? []).length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">Sin próximos turnos.</p>
          ) : (
            <ul className="divide-y divide-border">
              {(stats?.proximos ?? []).map((t: any) => (
                <li key={t.id} className="px-5 py-3">
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.fecha + "T00:00:00").toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })} · {t.hora.slice(0,5)}
                  </p>
                  <p className="text-sm font-medium">{t.clientes?.nombre}</p>
                  <p className="text-xs text-muted-foreground">{t.servicios?.nombre}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    confirmado: "bg-success/15 text-success",
    pendiente: "bg-warning/15 text-yellow-700 dark:text-yellow-400",
    completado: "bg-primary/10 text-primary",
    cancelado: "bg-destructive/10 text-destructive",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${map[estado] ?? "bg-secondary"}`}>{estado}</span>;
}
