
import { useState } from 'react';
import { Plus, Search, Trash2, ShoppingCart, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/context/ProductContext';
import { SaleItem } from '@/types/sale';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Sales() {
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix'>('cash');
  const [discount, setDiscount] = useState(0);

  const filteredProducts = products.filter(product =>
    product.status === 'active' &&
    product.stock > 0 &&
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: 'Estoque insuficiente',
          description: `Só há ${product.stock} unidades disponíveis.`,
          variant: 'destructive',
        });
        return;
      }
      
      setCartItems(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.salePrice }
            : item
        )
      );
    } else {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        salePrice: product.salePrice,
        quantity: 1,
        total: product.salePrice,
      };
      setCartItems(prev => [...prev, newItem]);
    }

    toast({
      title: 'Produto adicionado',
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const item = cartItems.find(i => i.id === itemId);
    const product = products.find(p => p.id === item?.productId);
    
    if (product && newQuantity > product.stock) {
      toast({
        title: 'Estoque insuficiente',
        description: `Só há ${product.stock} unidades disponíveis.`,
        variant: 'destructive',
      });
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.salePrice }
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  const completeSale = () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar a venda.',
        variant: 'destructive',
      });
      return;
    }

    // Aqui você pode implementar a lógica de salvar a venda
    toast({
      title: 'Venda finalizada',
      description: `Venda de R$ ${total.toFixed(2)} realizada com sucesso!`,
    });

    // Limpar carrinho e dados
    setCartItems([]);
    setCustomerName('');
    setCustomerEmail('');
    setDiscount(0);
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomerName('');
    setCustomerEmail('');
    setDiscount(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Produtos */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Nova Venda</h1>
            <p className="text-muted-foreground">Selecione os produtos para venda</p>
          </div>
        </div>

        {/* Busca de Produtos */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos por nome ou SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{product.category}</Badge>
                    <span className="text-sm text-muted-foreground">Estoque: {product.stock}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">R$ {product.salePrice.toFixed(2)}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {/* Carrinho de Compras */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrinho ({cartItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Carrinho vazio</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.productSku}</p>
                      <p className="text-sm font-bold">R$ {item.salePrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dados do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nome do cliente (opcional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              placeholder="Email do cliente (opcional)"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Resumo da Venda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Desconto:</span>
                <Input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-24 h-8 text-right"
                  placeholder="0,00"
                />
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'pix') => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={completeSale}
                disabled={cartItems.length === 0}
              >
                Finalizar Venda
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Limpar Carrinho
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
