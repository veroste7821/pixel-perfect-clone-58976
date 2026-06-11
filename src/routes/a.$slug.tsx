import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock4, MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/a/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Reservar en ${params.slug} · Aurora` },
      { name: "description", content: "Reserva tu turno en línea." },
    ],
  }),
  component: PublicBooking,
});

const services = [
  { id: "s1", name: "Corte clásico", duration: "45 min", price: "$ 28" },
  { id: "s2", name: "Color completo", duration: "120 min", price: "$ 95" },
  { id: "s3", name: "Tratamiento capilar", duration: "60 min", price: "$ 42" },
  { id: "s4", name: "Barba premium", duration: "30 min", price: "$ 22" },
  { id: "s5", name: "Manicura", duration: "45 min", price: "$ 26" },
];

const slots = ["09:30", "10:15", "11:00", "11:45", "13:30", "14:15", "15:00", "16:30", "17:15"];

function PublicBooking() {
  const { slug } = Route.useParams();
  const [service, setService] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <span className="font-display text-lg italic">A</span>
            </div>
            <div className="leading-tight">
              <p className="font-display text-base">Studio Aurora</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Reserva en línea
              </p>
            </div>
          </div>
          <a href="/" className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
            Acceder ↗
          </a>
        </div>
      </div>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl grid-cols-12 gap-10 px-8 py-16">
          <div className="col-span-12 lg:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Capítulo I · La cita
            </p>
            <h1 className="mt-6 font-display text-6xl leading-[1.02] tracking-tight">
              Un momento <em className="italic text-accent">para usted</em>,
              <br />
              cuidado al detalle.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Elija el servicio, el horario y reserve en menos de un minuto. Confirmamos cada cita
              personalmente, como debe ser.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Av. del Libertador 1840</span>
              <span className="inline-flex items-center gap-2"><Clock4 className="h-3.5 w-3.5" /> Lun a Sáb · 9 a 19h</span>
              <span className="inline-flex items-center gap-2"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> 4.9 · 312 reseñas</span>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border lg:pl-10">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Nota</p>
            <p className="mt-6 font-display text-lg italic leading-snug">
              "Hay sitios donde el tiempo se mide en gestos. Aurora es uno de ellos."
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">— Revista Estilo, 2025</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-8 py-16">
        <div className="border-b border-border pb-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Paso 01</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">Elija un servicio</h2>
        </div>
        <ul className="mt-6 divide-y divide-border">
          {services.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setService(s.id)}
                className={
                  "grid w-full grid-cols-12 items-center gap-4 py-6 text-left transition " +
                  (service === s.id ? "" : "hover:bg-accent/5")
                }
              >
                <span
                  className={
                    "col-span-1 inline-block h-3 w-3 rounded-full border " +
                    (service === s.id ? "border-accent bg-accent" : "border-border")
                  }
                />
                <span className="col-span-6 font-display text-xl">{s.name}</span>
                <span className="col-span-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">{s.duration}</span>
                <span className="col-span-2 justify-self-end font-display text-xl tabular-nums">{s.price}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-16 border-b border-border pb-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Paso 02</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">Elija un horario</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Jueves, 12 de junio</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden border border-border bg-border sm:grid-cols-5 lg:grid-cols-9">
          {slots.map((t) => (
            <button
              key={t}
              onClick={() => setSlot(t)}
              className={
                "bg-card px-3 py-5 font-display text-lg tracking-tight transition " +
                (slot === t ? "bg-accent text-accent-foreground" : "hover:bg-accent/10")
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-16 border-b border-border pb-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Paso 03</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">Sus datos</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Nombre</span>
            <input className="mt-2 w-full border-0 border-b border-border bg-transparent py-2 font-display text-lg outline-none focus:border-accent" placeholder="Su nombre" />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Teléfono</span>
            <input className="mt-2 w-full border-0 border-b border-border bg-transparent py-2 font-display text-lg outline-none focus:border-accent" placeholder="+54 ..." />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Correo</span>
            <input className="mt-2 w-full border-0 border-b border-border bg-transparent py-2 font-display text-lg outline-none focus:border-accent" placeholder="usted@correo.com" />
          </label>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Resumen</p>
            <p className="mt-2 font-display text-2xl">
              {service ? services.find((s) => s.id === service)?.name : "Servicio por elegir"}
              {slot && <span className="text-muted-foreground"> · {slot}</span>}
            </p>
          </div>
          <button
            disabled={!service || !slot}
            className="rounded-sm bg-primary px-8 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
          >
            Confirmar reserva
          </button>
        </div>

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          {slug} · Aurora Studio Suite
        </p>
      </section>
    </div>
  );
}
