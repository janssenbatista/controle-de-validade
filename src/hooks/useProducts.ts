import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  description: string;
  expiration_date: string;
  stock: number;
  status: 'Vencido' | 'Crítico' | 'Atenção' | 'Válido';
}

async function fetchProducts(
  statusFilter: string | null,
  limit: number
): Promise<Product[]> {
  if (statusFilter) {
    const { data, error } = await supabase.rpc('get_products_by_status', {
      filter_status: statusFilter,
      p_limit: limit,
    });

    if (error) throw error;
    return data || [];
  } else {
    const { data, error } = await supabase.rpc('get_all_products', {
      p_limit: limit === -1 ? 0 : limit,
    });

    if (error) throw error;
    return data || [];
  }
}

export function useProducts(statusFilter: string | null, limit: number = 10) {
  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', statusFilter, limit],
    queryFn: () => fetchProducts(statusFilter, limit),
    staleTime: 1000 * 60 * 2,
  });

  return {
    products,
    loading,
    error: error as Error | null,
    refetch,
  };
}
