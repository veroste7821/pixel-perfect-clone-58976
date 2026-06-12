import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, CalendarCheck2, Clock, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reservar")({
  head: () => ({ meta: [
    { title: "Reservar turno · Agenda IA" },
    { name: "description", content: "Elegí el servicio, día y horario y reservá tu turno en segundos." },
  ] }),
  component: Reservar,
});

// Horarios de atención: 09:00 a 18:00, cada 30 minutos
const SLOTS = Array.from({ length: 18 }, (_, i) => {
  const h = 9 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

function fmtISO(d: Date) { return d.toISOString().slice(0, 10); }

function Reservar() {
  const hoy = fmtISO(new Date());
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [confirmado, setConfirmado] = useState<{ fecha: string; hora: string; servicio: string } | null>(null);

  const { data: servicios = [] } = useQuery({
    queryKey: ["servicios-public"],
    queryFn: async () =>
      (await supabase.from("servicios").select("id,nombre,duracion_min,precio").order("nombre")).data ?? [],
  });

  // Turnos ya tomados en la fecha elegida (excluye cancelados)
  const { data: ocupados = [] } = useQuery({
    queryKey: ["turnos-ocupados", fecha],
    enabled: !!fecha,
    queryFn: async () =>
      (await supabase.from("turnos").select("hora,estado").eq("fecha", fecha).neq("estado", "cancelado")).data ?? [],
  });

  const horasOcupadas = useMemo(
    () => new Set((ocupados as any[]).map((t) => String(t.hora).slice(0, 5))),
    [ocupados],
  );

  const servicio = useMemo(
    () => (servicios as any[]).find((s) => s.id === servicioId) ?? null,
    [servicios, servicioId],
  );

  const reservar = useMutation({
    mutationFn: async () => {
      const tel = telefono.trim();
      // Reutiliza el cliente si el teléfono ya existe; si no, lo crea
      const { data: existente } = await supabase
        .from("clientes").select("id").eq("telefono", tel).maybeSingle();

      let clienteId = existente?.id as string | undefined;
      if (!clienteId) {
        const { data: nuevo, error } = await supabase
          .from("clientes")
          .insert({ nombre: nombre.trim(), telefono: tel } as any)
          .select("id").single();
        if (error) throw error;
        clienteId = nuevo!.id;
      }

      const { error: errTurno } = await supabase.from("turnos").insert({
        cliente_id: clienteId,
        servicio_id: servicioId,
        fecha,
        hora,
        estado: "pendiente",
        observaciones: observaciones.trim() || "Solicitado vía Telegram",
      } as any);
      if (errTurno) throw errTurno;
    },
    onSuccess: () => {
      setConfirmado({ fecha, hora, servicio: servicio?.nombre ?? "" });
      toast.success("¡Turno solicitado!");
    },
    onError: (e: any) => toast.error(e.message ?? "No pudimos registrar el turno. Probá de nuevo."),
  });

  const valido = servicioId && fecha >= hoy && hora && nombre.trim().length >= 2 && telefono.trim().length >= 6;

  if (confirmado) {
    return (
      <Shell>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <CalendarCheck2 className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">¡Solicitud recibida!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pedimos tu turno de <span className="font-medium text-foreground">{confirmado.servicio}</span> para el{" "}
            <span className="font-medium text-foreground">
              {new Date(confirmado.fecha + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
            </span>{" "}
            a las <span className="font-medium text-foreground">{confirmado.hora} hs</span>.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Queda <span className="font-medium">pendiente de confirmación</span>: te avisamos por Telegram o WhatsApp en cuanto lo confirmemos.
          </p>
          <button
            onClick={() => { setConfirmado(null); setHora(""); setObservaciones(""); }}
            className="mt-6 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
          >
            Reservar otro turno
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Reservá tu turno</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Llegaste desde nuestro asistente de Telegram. Elegí servicio, día y horario y listo.
        </p>

        <div className="mt-6 space-y-5">
          {/* Servicio */}
          <div>
            <label className="text-sm font-medium">Servicio</label>
            <select
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccionar servicio…</option>
              {(servicios as any[]).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} · {s.duracion_min} min · ${Number(s.precio).toLocaleString("es-AR")}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-sm font-medium">Día</label>
            <input
              type="date" min={hoy} value={fecha}
              onChange={(e) => { setFecha(e.target.value); setHora(""); }}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Horarios */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="h-3.5 w-3.5" /> Horario disponible
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {SLOTS.map((slot) => {
                const ocupado = horasOcupadas.has(slot);
                const activo = hora === slot;
                return (
                  <button
                    key={slot} type="button" disabled={ocupado}
                    onClick={() => setHora(slot)}
                    className={`rounded-md border px-2 py-2 text-sm tabular-nums transition ${
                      ocupado
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through"
                        : activo
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:border-primary/40 hover:bg-accent"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Tu nombre</label>
              <input
                value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido"
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <input
                value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+54 9 ..."
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Observaciones <span className="text-muted-foreground">(opcional)</span></label>
            <textarea
              value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2}
              placeholder="Algo que tengamos que saber"
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            disabled={!valido || reservar.isPending}
            onClick={() => reservar.mutate()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {reservar.isPending ? "Enviando…" : "Solicitar turno"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            El turno queda pendiente hasta que el salón lo confirme.
          </p>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/40 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">Agenda IA</span>
        </Link>
        {children}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Llegaste acá por error? <Link to="/" className="underline hover:text-foreground">Ir al inicio</Link>
        </p>
      </div>
    </div>
  );
}
