
import { Package, DollarSign, AlertTriangle, Tag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCard } from '@/components/DashboardCard';
import { useProducts } from '@/context/ProductContext';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { stats, products } = useProducts();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema de gestão</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total de Produtos"
          value={stats.totalProducts}
          description="Produtos cadastrados"
          icon={Package}
          trend={{ value: 12, label: 'vs mês anterior' }}
        />
        <DashboardCard
          title="Valor Total do Estoque"
          value={formatCurrency(stats.totalValue)}
          description="Valor total em estoque"
          icon={DollarSign}
          trend={{ value: 8, label: 'vs mês anterior' }}
        />
        <DashboardCard
          title="Estoque Baixo"
          value={stats.lowStockProducts}
          description="Produtos com estoque ≤ 5"
          icon={AlertTriangle}
        />
        <DashboardCard
          title="Categorias"
          value={stats.categoriesCount}
          description="Categorias ativas"
          icon={Tag}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produtos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(product.salePrice)}</p>
                    <p className="text-sm text-muted-foreground">{product.stock} un.</p>
                  </div>
                </div>
              ))}
              {stats.recentProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum produto cadastrado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Categorias Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{category}</Badge>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{count} produtos</span>
                  </div>
                </div>
              ))}
              {topCategories.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum produto por categoria
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
