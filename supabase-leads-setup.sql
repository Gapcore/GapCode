-- ============================================================
-- GapCore — Setup da tabela leads (Supabase)
-- Projeto: qzkqgdtnybghmkuuargj
-- Execute no SQL Editor do Supabase Dashboard (uma vez).
-- ============================================================

-- Garante a tabela com todas as colunas do formulário
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

-- Se a tabela já existia sem os campos novos, adiciona-os
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS empresa TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS servico TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS mensagem TEXT;

-- Habilita Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas (se existirem) para recriar limpas
DROP POLICY IF EXISTS "Permitir insert anonimo em leads" ON public.leads;
DROP POLICY IF EXISTS "Permitir insert anônimo em leads" ON public.leads;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.leads;

-- Política necessária: visitantes do site (role anon) podem INSERIR
CREATE POLICY "Permitir insert anonimo em leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Opcional: apenas usuários autenticados (dashboard) leem os leads
DROP POLICY IF EXISTS "Permitir leitura autenticada" ON public.leads;

CREATE POLICY "Permitir leitura autenticada"
ON public.leads
FOR SELECT
TO authenticated
USING (true);
