-- ============================================
-- Row Level Security (RLS) Policies
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Habilitar Row Level Security (RLS) na tabela tb_products
ALTER TABLE tb_products ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver conflito)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tb_products;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON tb_products;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON tb_products;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON tb_products;

-- ============================================
-- Política para SELECT (Leitura)
-- Permite que qualquer usuário autenticado possa ler os produtos
-- ============================================
CREATE POLICY "Enable read access for authenticated users" 
ON tb_products FOR SELECT 
TO authenticated 
USING (true);

-- ============================================
-- Política para INSERT (Criação)
-- Permite que qualquer usuário autenticado possa inserir produtos
-- ============================================
CREATE POLICY "Enable insert access for authenticated users" 
ON tb_products FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- ============================================
-- Política para UPDATE (Atualização)
-- Permite que qualquer usuário autenticado possa atualizar produtos
-- ============================================
CREATE POLICY "Enable update access for authenticated users" 
ON tb_products FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- ============================================
-- Política para DELETE (Exclusão)
-- Permite que qualquer usuário autenticado possa deletar produtos
-- ============================================
CREATE POLICY "Enable delete access for authenticated users" 
ON tb_products FOR DELETE 
TO authenticated 
USING (true);

-- ============================================
-- Verificar as políticas criadas
-- ============================================
-- Execute a query abaixo para verificar se as políticas foram criadas corretamente:
-- SELECT * FROM pg_policies WHERE tablename = 'tb_products';
