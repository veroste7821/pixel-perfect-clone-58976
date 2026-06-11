import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, CalendarCheck2, Clock4, Users, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Panel · Aurora" },
      { name: "description", content: "Vista editorial del día: reservas, ocupación e ingresos." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Reservas hoy", value: "18", delta: "+3", icon: CalendarCheck2 },
  { label: "Ocupación", value: "82%", delta: "+6%", icon: Clock4 },
  { label: "Clientes nuevos", value: "07", delta: "+2", icon: Users },
  { label: "Ingresos del día", value: "$ 1.420", delta: "+9%", icon: Wallet },
];

const upcoming = [
  { time: "09:30", client: "Lucía Romero", service: "Corte & color", staff: "Mara", status: "Confirmado" },
  { time: "10:15", client: "Tomás Vega", service: "Barba premium", staff: "Iván", status: "Confirmado" },
  { time: "11:00", client: "Camila Ruiz", service: "Manicura", staff: "Sol", status: "Pendiente" },
  { time: "12:30", client: "Renata López", service: "Tratamiento capilar", staff: "Mara", status: "Confirmado" },
  { time: "14:00", client: "Diego Paz", service: "Corte clásico", staff: "Iván", status: "Confirmado" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <section className="grid grid-cols-12 gap-10 border-b border-border pb-12">
        <div className="col-span-12 lg:col-span-7">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Volumen XI · Edición de la mañana
          </p>
          <h1 className="mt-6 font-display text-6xl leading-[1.02] tracking-tight">
            Un día <em className="font-display italic text-accent">delicadamente</em>
            <br />
            orquestado.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Dieciocho citas distribuidas entre tres profesionales. La agenda respira sin sobresaltos:
            la mañana se inclina hacia el color, la tarde hacia el cuidado.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border lg:pl-10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Nota del editor</p>
          <p className="mt-6 font-display text-xl italic leading-snug">
            "La elegancia es la única belleza que jamás se marchita."
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">— Audrey Hepburn</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden border-x border-b border-border bg-border md:grid-cols-4">
        {kpis.map((k) => (
          <article key={k.label} className="bg-card p-8">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k.label}</p>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-6 font-display text-5xl tracking-tight">{k.value}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
              <ArrowUpRight className="h-3 w-3" />
              {k.delta} vs. ayer
            </p>
          </article>
        ))}
      </section>

      <section className="mt-16 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Próximas citas</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">La jornada, hora a hora</h2>
            </div>
            <a href="/agenda" className="text-xs uppercase tracking-[0.22em] text-accent hover:underline">
              Ver agenda completa →
            </a>
          </div>
          <ul className="mt-6 divide-y divide-border">
            {upcoming.map((u) => (
              <li key={u.time} className="grid grid-cols-12 items-center gap-4 py-5">
                <span className="col-span-2 font-display text-2xl tracking-tight">{u.time}</span>
                <div className="col-span-5">
                  <p className="text-sm">{u.client}</p>
                  <p className="text-xs text-muted-foreground">{u.service}</p>
                </div>
                <span className="col-span-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  con {u.staff}
                </span>
                <span
                  className={
                    "col-span-2 justify-self-end text-[10px] uppercase tracking-[0.22em] " +
                    (u.status === "Confirmado" ? "text-accent" : "text-muted-foreground")
                  }
                >
                  · {u.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="border-b border-border pb-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Profesionales</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">El equipo de hoy</h2>
          </div>
          <ul className="mt-6 space-y-6">
            {[
              { name: "Mara Beltrán", role: "Color & cuidado", count: 7 },
              { name: "Iván Soto", role: "Barbería", count: 6 },
              { name: "Sol Aguirre", role: "Manos & pies", count: 5 },
            ].map((s) => (
              <li key={s.name} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 font-display text-lg">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
                <span className="font-display text-2xl tabular-nums">{s.count}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
