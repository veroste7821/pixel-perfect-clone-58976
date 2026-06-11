import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda · Aurora" },
      { name: "description", content: "Vista semanal de la agenda del estudio." },
    ],
  }),
  component: Agenda,
});

const days = ["Lun 09", "Mar 10", "Mié 11", "Jue 12", "Vie 13", "Sáb 14"];
const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

type Booking = {
  day: number;
  hour: number;
  duration: number;
  client: string;
  service: string;
  status: "confirmed" | "pending" | "blocked";
};

const bookings: Booking[] = [
  { day: 0, hour: 0, duration: 2, client: "L. Romero", service: "Color", status: "confirmed" },
  { day: 0, hour: 4, duration: 1, client: "D. Paz", service: "Corte", status: "confirmed" },
  { day: 1, hour: 1, duration: 1, client: "T. Vega", service: "Barba", status: "pending" },
  { day: 1, hour: 3, duration: 2, client: "R. López", service: "Tratamiento", status: "confirmed" },
  { day: 2, hour: 0, duration: 1, client: "L. Romero", service: "Corte & color", status: "confirmed" },
  { day: 2, hour: 2, duration: 1, client: "C. Ruiz", service: "Manicura", status: "pending" },
  { day: 2, hour: 5, duration: 2, client: "Bloqueo", service: "Almuerzo", status: "blocked" },
  { day: 3, hour: 1, duration: 2, client: "M. Aguirre", service: "Color", status: "confirmed" },
  { day: 3, hour: 6, duration: 1, client: "I. Soto", service: "Barba", status: "confirmed" },
  { day: 4, hour: 0, duration: 1, client: "S. Ortiz", service: "Corte", status: "confirmed" },
  { day: 4, hour: 3, duration: 1, client: "P. Méndez", service: "Manicura", status: "pending" },
  { day: 5, hour: 1, duration: 3, client: "Evento", service: "Sesión privada", status: "blocked" },
];

function Agenda() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Semana 24</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight">Junio, en su justa medida</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-sm border border-border p-2 hover:bg-accent/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 font-display text-base">09 — 14 Junio</span>
          <button className="rounded-sm border border-border p-2 hover:bg-accent/10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mt-8 flex gap-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" />Confirmado</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-accent" />Pendiente</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-muted-foreground/60" />Bloqueado</span>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="grid min-w-[860px] grid-cols-[80px_repeat(6,1fr)] border border-border bg-card">
          <div className="border-b border-r border-border" />
          {days.map((d, i) => (
            <div
              key={d}
              className={"border-b border-border px-3 py-4 " + (i < 5 ? "border-r" : "")}
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{d.split(" ")[0]}</p>
              <p className="mt-1 font-display text-2xl">{d.split(" ")[1]}</p>
            </div>
          ))}

          {hours.map((h, hIdx) => (
            <div key={h} className="contents">
              <div className="border-r border-b border-border px-3 py-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {h}
              </div>
              {days.map((_, dIdx) => {
                const booking = bookings.find((b) => b.day === dIdx && b.hour === hIdx);
                const occupied = bookings.find(
                  (b) => b.day === dIdx && hIdx > b.hour && hIdx < b.hour + b.duration,
                );
                return (
                  <div
                    key={dIdx + "-" + hIdx}
                    className={
                      "relative h-20 border-b border-border " + (dIdx < 5 ? "border-r" : "")
                    }
                  >
                    {booking && (
                      <div
                        className={
                          "absolute inset-x-1 top-1 rounded-sm border px-2 py-1.5 text-[11px] leading-tight " +
                          (booking.status === "confirmed"
                            ? "border-accent/40 bg-accent/15 text-foreground"
                            : booking.status === "pending"
                              ? "border-accent/40 bg-background text-foreground"
                              : "border-border bg-muted text-muted-foreground")
                        }
                        style={{ height: `calc(${booking.duration * 5}rem - 0.5rem)` }}
                      >
                        <p className="font-medium">{booking.client}</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {booking.service}
                        </p>
                      </div>
                    )}
                    {!booking && !occupied && (
                      <button className="absolute inset-0 opacity-0 hover:opacity-100 hover:bg-accent/5 transition" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
