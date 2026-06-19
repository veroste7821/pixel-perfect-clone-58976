CREATE TABLE public.horarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana smallint NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio time NOT NULL,
  hora_fin time NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT horarios_rango_valido CHECK (hora_fin > hora_inicio),
  CONSTRAINT horarios_dia_unico UNIQUE (dia_semana)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.horarios TO anon, authenticated;
GRANT ALL ON public.horarios TO service_role;

ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY demo_all_horarios ON public.horarios FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.horarios (dia_semana, hora_inicio, hora_fin, activo) VALUES
  (1, '09:00', '18:00', true),
  (2, '09:00', '18:00', true),
  (3, '09:00', '18:00', true),
  (4, '09:00', '18:00', true),
  (5, '09:00', '18:00', true),
  (6, '09:00', '13:00', true),
  (0, '09:00', '13:00', false);
