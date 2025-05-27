
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/context/ProductContext';
import { TrendingUp, Package, DollarSign, AlertTriangle } from 'lucide-react';

export default function Reports() {
  const { products, categories } = useProducts();

  // Dados para gráfico de barras - produtos por categoria
  const categoryData = categories.map(category => ({
    name: category.name,
    quantidade: products.filter(p => p.category === category.name).length,
    valor: products
      .filter(p => p.category === category.name)
      .reduce((sum, p) => sum + (p.salePrice * p.stock), 0),
  }));

  // Dados para gráfico de pizza - distribuição de valor
  const pieData = categoryData.map((item, index) => ({
    name: item.name,
    value: item.valor,
    color: categories[index]?.color || '#3B82F6',
  }));

  // Produtos com maior margem de lucro
  const topProfitProducts = products
    .map(product => ({
      ...product,
      profit: product.salePrice - product.costPrice,
      profitMargin: ((product.salePrice - product.costPrice) / product.salePrice) * 100,
    }))
    .sort((a, b) => b.profitMargin - a.profitMargin)
    .slice(0, 5);

  // Produtos com estoque baixo
  const lowStockProducts = products
    .filter(product => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Análise detalhada do seu inventário</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Products by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Value Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Distribuição de Valor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Profit Margin Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produtos com Maior Margem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProfitProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.profit)} lucro
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {product.profitMargin.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.salePrice)}
                    </p>
                  </div>
                </div>
              ))}
              {topProfitProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum produto encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alerta de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg border-orange-200 bg-orange-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">
                      {product.stock} unidades
                    </p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Todos os produtos com estoque adequado! 🎉
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
