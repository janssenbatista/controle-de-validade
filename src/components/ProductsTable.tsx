import { Copy, Edit, Trash2 } from 'lucide-react';
import type { Product } from '../hooks/useProducts';

interface ProductsTableProps {
  products: Product[];
  selectedProducts: string[];
  isLoading: boolean;
  error: Error | null;
  onSelectProduct: (productId: string) => void;
  onSelectAll: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onCopy: (product: Product) => void;
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Validade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Editar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Excluir
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Copiar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-48" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-24" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-12" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductsTable({
  products,
  selectedProducts,
  isLoading,
  error,
  onSelectProduct,
  onSelectAll,
  onEdit,
  onDelete,
  onCopy,
}: ProductsTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <p className="text-red-600">Erro ao carregar produtos: {error.message}</p>
    );
  }

  if (products.length === 0) {
    return <p className="text-gray-600">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={
                  products.length > 0 &&
                  selectedProducts.length === products.length
                }
                onChange={onSelectAll}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Validade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Editar
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Excluir
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Copiar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => onSelectProduct(product.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(product.expiration_date).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.stock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'Vencido'
                      ? 'bg-red-100 text-red-950'
                      : product.status === 'Muito Crítico'
                        ? 'bg-red-300 text-red-900'
                        : product.status === 'Crítico'
                          ? 'bg-orange-100 text-orange-800'
                          : product.status === 'Atenção'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-yellow-600 cursor-pointer hover:text-yellow-700 transition">
                <Edit
                  className="inline-block"
                  size={18}
                  onClick={() => onEdit(product)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-red-600 cursor-pointer hover:text-red-700 transition">
                <Trash2
                  className="inline-block"
                  size={18}
                  onClick={() => onDelete(product)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600 cursor-pointer hover:text-gray-700 transition">
                <Copy
                  className="inline-block"
                  size={18}
                  onClick={() => onCopy(product)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
