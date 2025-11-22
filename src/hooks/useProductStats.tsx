import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface ProductStats {
  status: 'Vencido' | 'Crítico' | 'Atenção' | 'Válido';
  total_produtos: number;
}

async function fetchProductStats(): Promise<ProductStats[]> {
  const { data, error } = await supabase.rpc('get_product_stats');

  if (error) throw error;

  return data || [];
}

export function useProductStats() {
  const {
    data: stats = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product-stats'],
    queryFn: fetchProductStats,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  return { stats, loading, error: error as Error | null, refetch };
}
