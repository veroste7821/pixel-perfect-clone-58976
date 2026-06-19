import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Check, X, Trash2, Pencil, CalendarClock, Ban } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EstadoBadge } from "./app.index";

export const Route = createFileRoute("/app/agenda")({
  head: () => ({ meta: [{ title: "Agenda · Agenda IA" }] }),
  component: Agenda,
});

type Turno = {
  id: string; fecha: string; hora: string; estado: string; observaciones: string | null;
  cliente_id: string; servicio_id: string;
  clientes: { nombre: string; telefono: string } | null;
  servicios: { nombre: string; duracion_min: number; precio: number } | null;
};

function startOfWeek(d = new Date()) {
  const x = new Date(d); const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day); x.setHours(0,0,0,0); return x;
}
function fmtISO(d: Date) { return d.toISOString().slice(0,10); }

function Agenda() {
  const qc = useQueryClient();
  const [weekStart, setWeekStart] = useState(startOfWeek());
  const [editing, setEditing] = useState<Partial<Turno> | null>(null);
  const [focusReschedule, setFocusReschedule] = useState(false);

  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate()+i); return d; }), [weekStart]);
  const from = fmtISO(week[0]); const to = fmtISO(week[6]);

  const { data: turnos = [] } = useQuery({
    queryKey: ["turnos", from, to],
    queryFn: async () => {
      const { data } = await supabase.from("turnos")
        .select("*, clientes(nombre,telefono), servicios(nombre,duracion_min,precio)")
        .gte("fecha", from).lte("fecha", to).order("fecha").order("hora");
      return (data ?? []) as Turno[];
    },
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes-all"],
    queryFn: async () => (await supabase.from("clientes").select("id,nombre,telefono").order("nombre")).data ?? [],
  });
  const { data: servicios = [] } = useQuery({
    queryKey: ["servicios-all"],
    queryFn: async () => (await supabase.from("servicios").select("id,nombre,duracion_min,precio").order("nombre")).data ?? [],
  });

  const upsert = useMutation({
    mutationFn: async (t: any) => {
      if (t.id) {
        const { id, clientes: _c, servicios: _s, ...rest } = t;
        return supabase.from("turnos").update(rest as any).eq("id", id).throwOnError();
      }
      return supabase.from("turnos").insert(t as any).throwOnError();
    },
    onSuccess: () => { qc.invalidateQueries(); toast.success("Turno guardado"); setEditing(null); },
    onError: (e: any) => toast.error(e.message ?? "Error al guardar"),
  });

  const changeEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) =>
      supabase.from("turnos").update({ estado } as any).eq("id", id).throwOnError(),
    onSuccess: () => { qc.invalidateQueries(); toast.success("Estado actualizado"); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => supabase.from("turnos").delete().eq("id", id).throwOnError(),
    onSuccess: () => { qc.invalidateQueries(); toast.success("Turno eliminado"); },
  });

  const byDay = (iso: string) => turnos.filter((t) => t.fecha === iso);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Agenda</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Semana del {week[0].toLocaleDateString("es-AR", { day: "numeric", month: "short" })} al {week[6].toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setWeekStart((d) => { const x = new Date(d); x.setDate(x.getDate()-7); return x; })} className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">← Semana</button>
          <button onClick={() => setWeekStart(startOfWeek())} className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">Hoy</button>
          <button onClick={() => setWeekStart((d) => { const x = new Date(d); x.setDate(x.getDate()+7); return x; })} className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">Semana →</button>
          <button onClick={() => setEditing({ fecha: fmtISO(new Date()), hora: "10:00", estado: "confirmado" })} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Nuevo turno
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-7">
        {week.map((d) => {
          const iso = fmtISO(d);
          const items = byDay(iso);
          const isToday = iso === fmtISO(new Date());
          return (
            <div key={iso} className={`rounded-xl border bg-card ${isToday ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`}>
              <div className="border-b border-border px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{d.toLocaleDateString("es-AR", { weekday: "short" })}</p>
                <p className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>{d.getDate()}</p>
              </div>
              <div className="space-y-2 p-2 min-h-[120px]">
                {items.length === 0 && <p className="px-1 py-3 text-center text-[11px] text-muted-foreground">—</p>}
                {items.map((t) => (
                  <div key={t.id} className="group rounded-md border border-border bg-background p-2 hover:border-primary/40">
                    <button onClick={() => { setFocusReschedule(false); setEditing(t); }} className="block w-full text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tabular-nums">{t.hora.slice(0,5)}</span>
                        <EstadoBadge estado={t.estado} />
                      </div>
                      <p className="mt-1 truncate text-xs font-medium">{t.clientes?.nombre}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{t.servicios?.nombre}</p>
                    </button>
                    <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => { setFocusReschedule(true); setEditing(t); }}
                        title="Reagendar"
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded border border-input bg-background px-1.5 py-1 text-[10px] hover:bg-accent"
                      >
                        <CalendarClock className="h-3 w-3" /> Reagendar
                      </button>
                      {t.estado !== "cancelado" && (
                        <button
                          onClick={() => { if (confirm("¿Cancelar este turno?")) changeEstado.mutate({ id: t.id, estado: "cancelado" }); }}
                          title="Cancelar turno"
                          className="inline-flex items-center justify-center rounded border border-input bg-background px-1.5 py-1 text-[10px] text-destructive hover:bg-destructive/10"
                        >
                          <Ban className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? "Editar turno" : "Nuevo turno"}</h2>
              <button onClick={() => setEditing(null)} className="rounded-md p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>

            <form className="mt-4 grid gap-3" onSubmit={(e) => { e.preventDefault(); upsert.mutate(editing); }}>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Cliente</label>
                <select value={editing.cliente_id ?? ""} onChange={(e) => setEditing({ ...editing, cliente_id: e.target.value })} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Seleccionar…</option>
                  {clientes.map((c: any) => <option key={c.id} value={c.id}>{c.nombre} · {c.telefono}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Servicio</label>
                <select value={editing.servicio_id ?? ""} onChange={(e) => setEditing({ ...editing, servicio_id: e.target.value })} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Seleccionar…</option>
                  {servicios.map((s: any) => <option key={s.id} value={s.id}>{s.nombre} · {s.duracion_min}min · ${s.precio}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Fecha</label>
                  <input type="date" required value={editing.fecha ?? ""} onChange={(e) => setEditing({ ...editing, fecha: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Hora</label>
                  <input type="time" required value={(editing.hora ?? "").slice(0,5)} onChange={(e) => setEditing({ ...editing, hora: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Estado</label>
                <select value={editing.estado ?? "confirmado"} onChange={(e) => setEditing({ ...editing, estado: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {["pendiente","confirmado","completado","cancelado"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Observaciones</label>
                <textarea rows={2} value={editing.observaciones ?? ""} onChange={(e) => setEditing({ ...editing, observaciones: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {editing.id && (
                    <>
                      <button type="button" onClick={() => changeEstado.mutate({ id: editing.id!, estado: "completado" })} className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs hover:bg-accent"><Check className="h-3.5 w-3.5" /> Completar</button>
                      <button type="button" onClick={() => changeEstado.mutate({ id: editing.id!, estado: "cancelado" })} className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs hover:bg-accent">Cancelar</button>
                      <button type="button" onClick={() => { if (confirm("Eliminar turno?")) { remove.mutate(editing.id!); setEditing(null); } }} className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /> Eliminar</button>
                    </>
                  )}
                </div>
                <button type="submit" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Pencil className="h-3.5 w-3.5" /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
