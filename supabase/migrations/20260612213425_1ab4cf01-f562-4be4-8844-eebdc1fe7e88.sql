
-- Servicios
CREATE TABLE public.servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  duracion_min INT NOT NULL DEFAULT 30,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.servicios TO anon, authenticated;
GRANT ALL ON public.servicios TO service_role;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_all_servicios" ON public.servicios FOR ALL USING (true) WITH CHECK (true);

-- Clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  observaciones TEXT,
  ultima_visita DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO anon, authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_all_clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);

-- Turnos
CREATE TYPE turno_estado AS ENUM ('pendiente','confirmado','completado','cancelado');
CREATE TABLE public.turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  servicio_id UUID NOT NULL REFERENCES public.servicios(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado turno_estado NOT NULL DEFAULT 'confirmado',
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_turnos_fecha ON public.turnos(fecha);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.turnos TO anon, authenticated;
GRANT ALL ON public.turnos TO service_role;
ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_all_turnos" ON public.turnos FOR ALL USING (true) WITH CHECK (true);

-- Seed: Servicios
INSERT INTO public.servicios (nombre, duracion_min, precio) VALUES
  ('Corte de cabello', 30, 3500),
  ('Color y mechas', 90, 12000),
  ('Manicura', 45, 4000),
  ('Tratamiento facial', 60, 8500),
  ('Barba y afeitado', 30, 3000);

-- Seed: Clientes (20)
INSERT INTO public.clientes (nombre, telefono, observaciones, ultima_visita) VALUES
  ('Lucía Romero', '+54 9 11 5544-1010', 'Prefiere mañanas', CURRENT_DATE - 12),
  ('Tomás Vega', '+54 9 11 5544-1011', NULL, CURRENT_DATE - 5),
  ('Camila Ruiz', '+54 9 11 5544-1012', 'Alérgica a parabenos', CURRENT_DATE - 20),
  ('Renata López', '+54 9 11 5544-1013', NULL, CURRENT_DATE - 3),
  ('Diego Paz', '+54 9 11 5544-1014', 'Cliente frecuente', CURRENT_DATE - 7),
  ('Sofía Herrera', '+54 9 11 5544-1015', NULL, CURRENT_DATE - 30),
  ('Martín Acosta', '+54 9 11 5544-1016', NULL, CURRENT_DATE - 15),
  ('Valeria Núñez', '+54 9 11 5544-1017', 'Prefiere a Mara', CURRENT_DATE - 9),
  ('Joaquín Ríos', '+54 9 11 5544-1018', NULL, CURRENT_DATE - 22),
  ('Florencia Díaz', '+54 9 11 5544-1019', NULL, CURRENT_DATE - 1),
  ('Nicolás Vidal', '+54 9 11 5544-1020', NULL, CURRENT_DATE - 18),
  ('Agustina Méndez', '+54 9 11 5544-1021', 'Cabello fino', CURRENT_DATE - 11),
  ('Federico Luna', '+54 9 11 5544-1022', NULL, CURRENT_DATE - 4),
  ('Micaela Torres', '+54 9 11 5544-1023', NULL, CURRENT_DATE - 27),
  ('Bruno Castro', '+54 9 11 5544-1024', NULL, CURRENT_DATE - 14),
  ('Antonella Ortiz', '+54 9 11 5544-1025', 'Llega temprano', CURRENT_DATE - 6),
  ('Ezequiel Pérez', '+54 9 11 5544-1026', NULL, CURRENT_DATE - 19),
  ('Julieta Romero', '+54 9 11 5544-1027', NULL, CURRENT_DATE - 8),
  ('Mateo Silva', '+54 9 11 5544-1028', NULL, CURRENT_DATE - 25),
  ('Catalina Bravo', '+54 9 11 5544-1029', 'Cliente VIP', CURRENT_DATE - 2);

-- Seed: Turnos (15) — mezcla pasada/hoy/futuro
INSERT INTO public.turnos (cliente_id, servicio_id, fecha, hora, estado, observaciones)
SELECT c.id, s.id, t.fecha::date, t.hora::time, t.estado::turno_estado, t.obs
FROM (VALUES
  ('Lucía Romero', 'Color y mechas', CURRENT_DATE, '09:30', 'confirmado', NULL),
  ('Tomás Vega', 'Barba y afeitado', CURRENT_DATE, '10:15', 'confirmado', NULL),
  ('Camila Ruiz', 'Manicura', CURRENT_DATE, '11:00', 'pendiente', 'Confirmar por WhatsApp'),
  ('Renata López', 'Tratamiento facial', CURRENT_DATE, '12:30', 'confirmado', NULL),
  ('Diego Paz', 'Corte de cabello', CURRENT_DATE, '14:00', 'confirmado', NULL),
  ('Sofía Herrera', 'Corte de cabello', CURRENT_DATE, '15:30', 'pendiente', NULL),
  ('Martín Acosta', 'Barba y afeitado', CURRENT_DATE + 1, '10:00', 'confirmado', NULL),
  ('Valeria Núñez', 'Color y mechas', CURRENT_DATE + 1, '11:30', 'confirmado', NULL),
  ('Joaquín Ríos', 'Corte de cabello', CURRENT_DATE + 1, '15:00', 'pendiente', NULL),
  ('Florencia Díaz', 'Manicura', CURRENT_DATE + 2, '09:00', 'confirmado', NULL),
  ('Nicolás Vidal', 'Corte de cabello', CURRENT_DATE + 2, '10:30', 'confirmado', NULL),
  ('Agustina Méndez', 'Tratamiento facial', CURRENT_DATE + 3, '14:00', 'confirmado', NULL),
  ('Federico Luna', 'Barba y afeitado', CURRENT_DATE - 1, '09:30', 'completado', NULL),
  ('Micaela Torres', 'Manicura', CURRENT_DATE - 1, '11:00', 'completado', NULL),
  ('Bruno Castro', 'Corte de cabello', CURRENT_DATE - 2, '16:00', 'cancelado', 'Cliente reagendó')
) AS t(cliente, servicio, fecha, hora, estado, obs)
JOIN public.clientes c ON c.nombre = t.cliente
JOIN public.servicios s ON s.nombre = t.servicio;
