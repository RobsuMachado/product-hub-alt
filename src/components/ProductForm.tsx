
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/product';
import { useProducts } from '@/context/ProductContext';
import { Upload } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: any) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const { categories } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    sku: '',
    status: 'active' as 'active' | 'inactive',
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        costPrice: product.costPrice.toString(),
        salePrice: product.salePrice.toString(),
        stock: product.stock.toString(),
        sku: product.sku,
        status: product.status,
        imageUrl: product.imageUrl || '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      costPrice: parseFloat(formData.costPrice),
      salePrice: parseFloat(formData.salePrice),
      stock: parseInt(formData.stock),
      sku: formData.sku,
      status: formData.status,
      imageUrl: formData.imageUrl,
    };

    onSubmit(productData);
  };

  const generateSKU = () => {
    const categoryCode = formData.category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const timestamp = Date.now().toString().slice(-3);
    setFormData(prev => ({ ...prev, sku: `${categoryCode}${randomNum}${timestamp}` }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primeira linha - Nome e Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Imagem do Produto */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Imagem do Produto</Label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
            {formData.imageUrl && (
              <div className="border rounded-lg p-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview do produto" 
                  className="h-24 w-24 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Segunda linha - Preços e Estoque */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costPrice">Preço de Custo *</Label>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salePrice">Preço de Venda *</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Estoque *</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Terceira linha - SKU e Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <div className="flex gap-2">
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                required
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={generateSKU} size="sm">
                Gerar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {product ? 'Atualizar' : 'Criar'} Produto
          </Button>
        </div>
      </form>
    </div>
  );
};
