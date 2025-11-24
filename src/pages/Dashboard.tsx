import {
  AlertTriangle,
  CalendarOff,
  ClockAlert,
  ClockCheck,
  LogOut,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useState, type FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProductStatusCard from '../components/ProductStatusCard';
import ProductsTable from '../components/ProductsTable';
import { useAuth } from '../contexts/AuthContext';
import { useProductStats, type ProductStats } from '../hooks/useProductStats';
import { useProducts } from '../hooks/useProducts';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const { stats, loading, error } = useProductStats();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    expiration_date: '',
    stock: '',
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = useProducts(selectedStatus, limit);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const addProductMutation = useMutation({
    mutationFn: async (productData: {
      description: string;
      expiration_date: string;
      stock: string;
    }) => {
      const { error } = await supabase.from('tb_products').insert([
        {
          description: productData.description,
          expiration_date: productData.expiration_date,
          stock: parseInt(productData.stock),
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar e refazer as queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      setIsModalOpen(false);
      setFormData({ description: '', expiration_date: '', stock: '' });
    },
    onError: (error) => {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar produto. Tente novamente.');
    },
  });

  const deleteProductsMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      const { error } = await supabase
        .from('tb_products')
        .delete()
        .in('id', productIds);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar e refazer as queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      setSelectedProducts([]);
    },
    onError: (error) => {
      console.error('Erro ao remover produtos:', error);
      alert('Erro ao remover produtos. Tente novamente.');
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const filteredProducts = (() => {
    if (!searchTerm.trim()) {
      return products;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return products.filter((product) =>
      product.description.toLowerCase().includes(lowerSearch)
    );
  })();

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja remover ${selectedProducts.length} produto(s)?`
    );

    if (!confirmDelete) return;

    deleteProductsMutation.mutate(selectedProducts);
  };

  const getStat = (
    status: 'Vencido' | 'Crítico' | 'Atenção' | 'Válido'
  ): ProductStats => {
    return (
      stats.find((s) => s.status === status) || {
        status: status,
        total_produtos: 0,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Controle de Validade
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex gap-2 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut />
              {'Sair'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando estatísticas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{`Erro ao carregar dados: ${error.message}`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-4 justify-around">
            <ProductStatusCard
              title="Produtos Vencidos"
              stats={getStat('Vencido')}
              quantity={getStat('Vencido').total_produtos}
              icon={CalendarOff}
              onClick={() => setSelectedStatus('Vencido')}
            />
            <ProductStatusCard
              title="Critico (7 dias)"
              stats={getStat('Crítico')}
              quantity={getStat('Crítico').total_produtos}
              icon={AlertTriangle}
              onClick={() => setSelectedStatus('Crítico')}
            />
            <ProductStatusCard
              title="Atenção (30 dias)"
              stats={getStat('Atenção')}
              quantity={getStat('Atenção').total_produtos}
              icon={ClockAlert}
              onClick={() => setSelectedStatus('Atenção')}
            />
            <ProductStatusCard
              title="Produtos Válidos"
              stats={getStat('Válido')}
              quantity={getStat('Válido').total_produtos}
              icon={ClockCheck}
              onClick={() => setSelectedStatus('Válido')}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                Produtos{selectedStatus ? ` - ${selectedStatus}` : ''}
              </h2>
              {selectedStatus && (
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Pesquisar por descrição... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Limpar pesquisa"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Mostrando {filteredProducts.length} de {products.length}{' '}
              produto(s)
            </div>
            <div className="flex items-center gap-4">
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={deleteProductsMutation.isPending}
                  className="flex gap-2 items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={20} />
                  {deleteProductsMutation.isPending
                    ? 'Removendo...'
                    : `Remover (${selectedProducts.length})`}
                </button>
              )}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="limit"
                  className="text-sm font-medium text-gray-700"
                >
                  Mostrar:
                </label>
                <select
                  id="limit"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  {selectedStatus && <option value={999999}>Todos</option>}
                </select>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex gap-2 items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <Plus size={20} />
                Adicionar
              </button>
            </div>
          </div>

          <ProductsTable
            products={filteredProducts}
            selectedProducts={selectedProducts}
            isLoading={loadingProducts}
            error={errorProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
          />
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black opacity-20 z-40 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Adicionar Produto
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-90"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Descrição
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      placeholder="Nome do produto"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="expiration_date"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Data de Validade
                    </label>
                    <input
                      type="date"
                      id="expiration_date"
                      name="expiration_date"
                      value={formData.expiration_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Estoque
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      placeholder="Quantidade em estoque"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={addProductMutation.isPending}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={addProductMutation.isPending}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addProductMutation.isPending
                        ? 'Adicionando...'
                        : 'Adicionar'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
