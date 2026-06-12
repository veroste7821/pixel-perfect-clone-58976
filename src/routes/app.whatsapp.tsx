import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Send, Phone, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp · Agenda IA" }] }),
  component: WhatsApp,
});

function WhatsApp() {
  const { data: turnos = [] } = useQuery({
    queryKey: ["wa-turnos"],
    queryFn: async () => (await supabase.from("turnos").select("*, clientes(nombre,telefono), servicios(nombre)").gte("fecha", new Date().toISOString().slice(0,10)).order("fecha").order("hora").limit(15)).data ?? [],
  });

  const [selected, setSelected] = useState<string | null>(null);
  const turno = useMemo(() => (turnos as any[]).find((t) => t.id === selected) ?? null, [turnos, selected]);

  const mensaje = turno
    ? `Hola ${turno.clientes?.nombre}, tu turno fue reservado para el día ${new Date(turno.fecha + "T00:00:00").toLocaleDateString("es-AR")} a las ${turno.hora.slice(0,5)}. Te esperamos.`
    : "Selecciona un turno para generar el mensaje.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">WhatsApp</h1>
      <p className="mt-1 text-sm text-muted-foreground">Estado de la integración y envío de confirmaciones.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Status card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success/15 text-success"><MessageCircle className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold">WhatsApp Business</p>
              <p className="flex items-center gap-1.5 text-xs text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Conectado</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Número</span>
              <span className="inline-flex items-center gap-1.5 font-medium"><Phone className="h-3.5 w-3.5" /> +54 9 0000 000000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mensajes hoy</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tiempo de respuesta</span>
              <span className="font-medium">~2 seg</span>
            </div>
          </div>
          <button className="mt-5 w-full rounded-md border border-input bg-background px-3 py-2 text-xs hover:bg-accent">Reconfigurar integración</button>
        </div>

        {/* Send message */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Enviar confirmación</h2>
          <p className="text-xs text-muted-foreground">Selecciona un turno y enviá el mensaje generado automáticamente.</p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Turno</label>
              <select value={selected ?? ""} onChange={(e) => setSelected(e.target.value || null)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Seleccionar turno…</option>
                {(turnos as any[]).map((t) => (
                  <option key={t.id} value={t.id}>
                    {new Date(t.fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })} {t.hora.slice(0,5)} · {t.clientes?.nombre}
                  </option>
                ))}
              </select>
              {turno && (
                <div className="mt-3 rounded-md border border-border bg-secondary/40 p-3 text-xs">
                  <p><span className="text-muted-foreground">Cliente:</span> {turno.clientes?.nombre}</p>
                  <p><span className="text-muted-foreground">Servicio:</span> {turno.servicios?.nombre}</p>
                  <p><span className="text-muted-foreground">Tel:</span> {turno.clientes?.telefono}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Mensaje</label>
              <div className="mt-1 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-success/15 px-3 py-2 text-sm text-foreground">
                  {mensaje}
                </div>
              </div>
              <button
                disabled={!turno}
                onClick={() => toast.success("Confirmación enviada por WhatsApp", { description: `A ${turno.clientes?.nombre}` })}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Enviar confirmación
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-3 text-xs">
            {[
              { t: "Confirmación", d: "Al reservar" },
              { t: "Recordatorio", d: "24hs antes" },
              { t: "Agradecimiento", d: "Tras la visita" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                <Check className="h-3.5 w-3.5 text-success" />
                <div><p className="font-medium">{x.t}</p><p className="text-muted-foreground">{x.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
