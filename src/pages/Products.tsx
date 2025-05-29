
import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductForm } from '@/components/ProductForm';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Products() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast({
      title: 'Produto removido',
      description: 'O produto foi removido com sucesso.',
    });
  };

  const handleFormSubmit = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso.',
      });
    } else {
      addProduct(productData);
      toast({
        title: 'Produto criado',
        description: 'O produto foi criado com sucesso.',
      });
    }
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredProducts.length} produto(s) encontrado(s)
      </div>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-center">Preço unitário</TableHead>
                <TableHead className="text-center">Valor total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= 5;
                const totalValue = product.salePrice * product.stock;
                
                return (
                  <TableRow key={product.id} className={isLowStock ? 'bg-orange-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded border flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sem foto</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          <p className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {isLowStock && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        <span className={isLowStock ? 'text-orange-500 font-medium' : ''}>{product.stock}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      R$ {product.salePrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      R$ {totalValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
          <Button onClick={handleAddProduct} className="mt-4">
            Criar primeiro produto
          </Button>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] max-h-[600px] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
