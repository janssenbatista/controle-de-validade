-- Função para buscar produtos por status
-- Execute este SQL no Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_products_by_status(filter_status text, p_limit integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  description text,
  expiration_date date,
  stock integer,
  status text
) 
LANGUAGE sql
AS $$
  SELECT
    id,
    description,
    expiration_date,
    stock,
    CASE
      WHEN expiration_date < CURRENT_DATE THEN 'Vencido'
      WHEN expiration_date <= (CURRENT_DATE + INTERVAL '7 days') THEN 'Crítico'
      WHEN expiration_date <= (CURRENT_DATE + INTERVAL '30 days') THEN 'Atenção'
      ELSE 'Válido'
    END AS status
  FROM
    tb_products
  WHERE
    CASE
      WHEN expiration_date < CURRENT_DATE THEN 'Vencido'
      WHEN expiration_date <= (CURRENT_DATE + INTERVAL '7 days') THEN 'Crítico'
      WHEN expiration_date <= (CURRENT_DATE + INTERVAL '30 days') THEN 'Atenção'
      ELSE 'Válido'
    END = filter_status
  ORDER BY
    expiration_date ASC
  LIMIT p_limit;
$$;

-- Função para buscar todos os produtos
CREATE OR REPLACE FUNCTION get_all_products(p_limit integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  description text,
  expiration_date date,
  stock integer,
  status text
) 
LANGUAGE sql
AS $$
  SELECT
    id,
    description,
    expiration_date,
    stock,
    CASE
      WHEN expiration_date < CURRENT_DATE THEN 'Vencido'
      WHEN expiration_date <= (CURRENT_DATE + INTERVAL '7 days') THEN 'Crítico'
      WHEN expiration_date <= (CURRENT_DATE + INTERVAL '30 days') THEN 'Atenção'
      ELSE 'Válido'
    END AS status
  FROM
    tb_products
  ORDER BY
    expiration_date ASC
  LIMIT p_limit;
$$;
