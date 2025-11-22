import type { LucideIcon } from 'lucide-react';
import type { ProductStats } from '../hooks/useProductStats';

function getColorByStatus(ProductStats: ProductStats): string {
  switch (ProductStats.status) {
    case 'Vencido':
      return 'bg-red-500';
    case 'Crítico':
      return 'bg-orange-500';
    case 'Atenção':
      return 'bg-yellow-500';
    case 'Válido':
      return 'bg-green-500';
  }
}

interface Props {
  title: string;
  stats: ProductStats;
  quantity: number;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function ProductStatusCard({
  title,
  stats,
  quantity,
  icon: Icon,
  onClick = () => {},
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-6 rounded-lg ${getColorByStatus(stats)} hover:opacity-80 col-span-2 md:col-span-4 lg:col-span-3 shadow-lg cursor-pointer`}
    >
      <div>
        <p className="font-medium text-white text-md">{title}</p>
        <span className="font-bold text-white text-5xl">{quantity}</span>
      </div>
      {Icon && <Icon className="text-white" size={42} />}
    </div>
  );
}
