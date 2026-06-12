import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, CalendarCheck2, BellRing, Settings2, Sparkles, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Agenda IA · Turnos por WhatsApp para profesionales" },
    { name: "description", content: "Recibe turnos por WhatsApp sin llamadas ni mensajes interminables. Confirmaciones y recordatorios automáticos." },
  ] }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">Agenda IA</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#beneficios" className="hover:text-foreground">Beneficios</a>
            <a href="#como" className="hover:text-foreground">Cómo funciona</a>
            <Link to="/login" className="hover:text-foreground">Iniciar sesión</Link>
          </nav>
          <Link to="/app" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Probar Demo
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Integrado con WhatsApp Business
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Recibe turnos por WhatsApp sin llamadas ni mensajes interminables.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Agenda IA convierte cada mensaje en una reserva confirmada. Recordatorios automáticos, agenda siempre al día y cero fricción para tus clientes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/app" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Probar Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center rounded-md border border-input bg-background px-5 py-3 text-sm font-medium hover:bg-accent">
                Iniciar sesión
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Sin tarjeta · Datos de ejemplo precargados</p>
          </div>

          {/* Mock chat preview */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success"><MessageCircle className="h-4 w-4" /></div>
                <div>
                  <p className="text-sm font-medium">WhatsApp · Lucía Romero</p>
                  <p className="text-xs text-muted-foreground">en línea</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-secondary px-4 py-2">Hola! Quería sacar turno para color 🙌</div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-primary-foreground">
                  Hola Lucía! Tengo disponible jueves 10:00 o viernes 15:30. ¿Cuál te queda mejor?
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-secondary px-4 py-2">Jueves 10 ✨</div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-primary-foreground">
                  Reservado ✅ Te envío recordatorio 24hs antes.
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 hidden rounded-xl border border-border bg-card px-4 py-3 shadow-lg md:block">
              <p className="text-xs text-muted-foreground">Turno creado automáticamente</p>
              <p className="text-sm font-semibold">Jueves 10:00 · Color y mechas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Todo lo que necesitas, nada más</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">Pensado para profesionales independientes que quieren simplicidad sin perder control.</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarCheck2, title: "Agenda automática", desc: "Cada reserva se carga al instante en tu calendario." },
              { icon: MessageCircle, title: "Confirmaciones instantáneas", desc: "El cliente recibe el detalle por WhatsApp al confirmar." },
              { icon: BellRing, title: "Recordatorios", desc: "24hs antes del turno, sin que tengas que hacer nada." },
              { icon: Settings2, title: "Gestión simple", desc: "Editá, cancelá o marcá como completado en un clic." },
            ].map((b) => (
              <div key={b.title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Empezá en 3 pasos</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Cargá tus servicios", d: "Definí duración y precio. Llevás lo que ya tenés." },
            { n: "02", t: "Conectá tu WhatsApp", d: "Asociá tu número y dejá que la IA responda por vos." },
            { n: "03", t: "Recibí turnos 24/7", d: "Tus clientes reservan solos, vos te enfocás en atender." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-card p-6">
              <span className="text-xs font-medium text-primary">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl border border-border bg-card p-10 md:p-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Probá la demo ahora</h2>
              <p className="mt-3 text-muted-foreground">Sin registro. Datos de ejemplo precargados para que veas el sistema funcionando de punta a punta.</p>
              <ul className="mt-6 space-y-2 text-sm">
                {["20 clientes precargados","15 turnos de muestra","5 servicios listos","Automatizaciones simuladas"].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {x}</li>
                ))}
              </ul>
            </div>
            <div className="md:text-right">
              <Link to="/app" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90">
                Entrar a la Demo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 Agenda IA · Demo</p>
          <p>Hecho con ❤️ para profesionales independientes</p>
        </div>
      </footer>
    </div>
  );
}
