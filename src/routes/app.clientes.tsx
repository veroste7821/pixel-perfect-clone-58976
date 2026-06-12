import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/clientes")({
  head: () => ({ meta: [{ title: "Clientes · Agenda IA" }] }),
  component: Clientes,
});

function Clientes() {
  const [q, setQ] = useState("");

  const { data = [] } = useQuery({
    queryKey: ["clientes-list"],
    queryFn: async () => {
      const { data: clientes } = await supabase.from("clientes").select("*").order("nombre");
      const ids = (clientes ?? []).map((c) => c.id);
      if (ids.length === 0) return [];
      const { data: turnos } = await supabase.from("turnos").select("cliente_id,fecha,hora,estado").in("cliente_id", ids);
      const today = new Date().toISOString().slice(0,10);
      return (clientes ?? []).map((c) => {
        const t = (turnos ?? []).filter((x) => x.cliente_id === c.id);
        const prox = t.filter((x) => x.fecha >= today && x.estado !== "cancelado").sort((a,b) => (a.fecha+a.hora).localeCompare(b.fecha+b.hora))[0];
        return { ...c, proximo: prox ?? null };
      });
    },
  });

  const filtered = data.filter((c: any) => c.nombre.toLowerCase().includes(q.toLowerCase()) || c.telefono.includes(q));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data.length} clientes en tu base</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o teléfono…" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">WhatsApp</th>
              <th className="px-4 py-3 font-medium">Última visita</th>
              <th className="px-4 py-3 font-medium">Próximo turno</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c: any) => (
              <tr key={c.id} className="hover:bg-accent/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{c.nombre.split(" ").map((w: string) => w[0]).slice(0,2).join("")}</div>
                    <div>
                      <p className="font-medium">{c.nombre}</p>
                      {c.observaciones && <p className="text-xs text-muted-foreground">{c.observaciones}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <a href={`https://wa.me/${c.telefono.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                    <Phone className="h-3.5 w-3.5" /> {c.telefono}
                  </a>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.ultima_visita ? new Date(c.ultima_visita + "T00:00:00").toLocaleDateString("es-AR") : "—"}</td>
                <td className="px-4 py-3">
                  {c.proximo ? (
                    <span>{new Date(c.proximo.fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })} · {c.proximo.hora.slice(0,5)}</span>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">No se encontraron clientes.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
