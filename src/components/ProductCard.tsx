
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const isLowStock = product.stock <= 5;
  const profit = product.salePrice - product.costPrice;
  const profitMargin = ((profit / product.salePrice) * 100).toFixed(1);

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">SKU:</span>
            <span className="text-sm font-mono">{product.sku}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Preço:</span>
            <span className="text-sm font-semibold">R$ {product.salePrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Margem:</span>
            <span className="text-sm font-semibold text-green-600">{profitMargin}%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estoque:</span>
            <div className="flex items-center gap-1">
              {isLowStock && <AlertTriangle className="h-3 w-3 text-orange-500" />}
              <span className={`text-sm font-semibold ${isLowStock ? 'text-orange-500' : ''}`}>
                {product.stock} un.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
            {product.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
