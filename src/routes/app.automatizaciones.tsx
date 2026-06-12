import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, MessageCircle, BellRing, Sparkles, Heart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/automatizaciones")({
  head: () => ({ meta: [{ title: "Automatizaciones · Agenda IA" }] }),
  component: Automatizaciones,
});

const flows = [
  {
    title: "Confirmación automática",
    desc: "Al crearse el turno, el cliente recibe el detalle por WhatsApp.",
    icon: CheckCircle2,
    active: true,
    steps: [
      { icon: Clock, label: "Trigger", detail: "Se crea turno" },
      { icon: Sparkles, label: "Acción", detail: "Generar mensaje" },
      { icon: MessageCircle, label: "Envío", detail: "WhatsApp al cliente" },
    ],
  },
  {
    title: "Recordatorio 24hs antes",
    desc: "Disminuye el ausentismo enviando un mensaje el día previo.",
    icon: BellRing,
    active: true,
    steps: [
      { icon: Clock, label: "Trigger", detail: "24hs antes del turno" },
      { icon: Sparkles, label: "Acción", detail: "Plantilla recordatorio" },
      { icon: MessageCircle, label: "Envío", detail: "WhatsApp al cliente" },
    ],
  },
  {
    title: "Agradecimiento post-visita",
    desc: "Después del turno completado, enviá un mensaje cálido y pedí review.",
    icon: Heart,
    active: false,
    steps: [
      { icon: Clock, label: "Trigger", detail: "1h después del turno" },
      { icon: Sparkles, label: "Acción", detail: "Mensaje + link review" },
      { icon: MessageCircle, label: "Envío", detail: "WhatsApp al cliente" },
    ],
  },
];

function Automatizaciones() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Automatizaciones</h1>
      <p className="mt-1 text-sm text-muted-foreground">Flujos automáticos que trabajan por vos en WhatsApp.</p>

      <div className="mt-6 space-y-4">
        {flows.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                <span className={f.active ? "text-success" : "text-muted-foreground"}>{f.active ? "Activo" : "Inactivo"}</span>
                <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${f.active ? "bg-success" : "bg-muted"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${f.active ? "translate-x-4" : "translate-x-1"}`} />
                </span>
              </label>
            </div>

            <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {f.steps.map((s, i) => (
                <>
                  <div key={s.label} className="rounded-md border border-border bg-secondary/40 p-3">
                    <div className="flex items-center gap-2">
                      <s.icon className="h-3.5 w-3.5 text-primary" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{s.label}</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{s.detail}</p>
                  </div>
                  {i < f.steps.length - 1 && (
                    <ArrowRight key={`arrow-${i}`} className="hidden h-4 w-4 text-muted-foreground sm:block" />
                  )}
                </>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
        <p className="text-sm font-medium">Próximamente</p>
        <p className="mt-1 text-xs text-muted-foreground">IA que responde consultas · Reservas automáticas · Pagos online · Google Calendar · Mercado Pago · n8n</p>
      </div>
    </div>
  );
}
