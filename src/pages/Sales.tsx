import { useState } from 'react';
import { Plus, Minus, Search, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { SaleItem } from '@/types/sale';

export default function Sales() {
  const { products } = useProducts();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix'>('cash');
  const [discount, setDiscount] = useState(0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.salePrice }
          : item
      );
      setCart(updatedCart);
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
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
  };

  const increaseQuantity = (itemId: string) => {
    const updatedCart = cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.salePrice }
        : item
    );
    setCart(updatedCart);
  };

  const decreaseQuantity = (itemId: string) => {
    const updatedCart = cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(1, item.quantity - 1), total: Math.max(1, item.quantity - 1) * item.salePrice }
        : item
    );
    setCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar a compra.',
      });
      return;
    }

    // Lógica de finalização da compra aqui (simulação)
    toast({
      title: 'Compra finalizada',
      description: 'A compra foi finalizada com sucesso!',
    });

    // Limpar o carrinho após a finalização
    setCart([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Left Panel - Product Search */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Produtos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sem foto</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-green-600">
                        R$ {product.salePrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Estoque: {product.stock}
                      </span>
                    </div>
                    
                    <Button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Cart and Checkout */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Carrinho de Compras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-muted-foreground">Carrinho vazio</p>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => decreaseQuantity(item.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => increaseQuantity(item.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="ml-2">{item.productName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">R$ {item.total.toFixed(2)}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="font-semibold">
                  Subtotal: R$ {calculateSubtotal().toFixed(2)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'pix') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (%)</Label>
              <Input
                id="discount"
                type="number"
                value={discount.toString()}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="font-semibold">
              Total: R$ {calculateTotal().toFixed(2)}
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Finalizar Compra
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
