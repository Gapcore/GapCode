-- ============================================================
-- GapCore — Setup leads (OBRIGATÓRIO para o formulário funcionar)
-- Projeto CORRETO: ddfvcqgzcrbchjicchty
-- URL: https://ddfvcqgzcrbchjicchty.supabase.co
--
-- NÃO execute isto no projeto qzkqgdtnybghmkuuargj
-- (esse host NÃO EXISTE no DNS → ERR_NAME_NOT_RESOLVED).
--
-- No Dashboard Supabase do projeto ddfvcqgzcrbchjicchty:
-- SQL Editor → New query → cole tudo → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  empresa TEXT,
  telefone TEXT,
  email TEXT NOT NULL,
  servico TEXT,
  mensagem TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS empresa TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS servico TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS mensagem TEXT;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insert anonimo em leads" ON public.leads;
DROP POLICY IF EXISTS "Permitir insert anônimo em leads" ON public.leads;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.leads;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leads;

-- Necessário: o site público usa a role anon (publishable / anon key)
CREATE POLICY "Permitir insert anonimo em leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Cobre clientes que chegam como role public
DROP POLICY IF EXISTS "Permitir insert public em leads" ON public.leads;
CREATE POLICY "Permitir insert public em leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Também permite authenticated
DROP POLICY IF EXISTS "Permitir insert authenticated em leads" ON public.leads;
CREATE POLICY "Permitir insert authenticated em leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Leitura só para usuários autenticados (dashboard), opcional
DROP POLICY IF EXISTS "Permitir leitura autenticada" ON public.leads;
CREATE POLICY "Permitir leitura autenticada"
ON public.leads
FOR SELECT
TO authenticated
USING (true);
