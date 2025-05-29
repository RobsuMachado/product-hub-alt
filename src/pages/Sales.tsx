import { useState } from 'react';
import { Plus, Minus, Search, Trash2, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Campos específicos para cada método de pagamento
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cashReceived, setCashReceived] = useState(0);
  const [pixKey, setPixKey] = useState('');

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

    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    // Validações específicas por método de pagamento
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        toast({
          title: 'Dados incompletos',
          description: 'Preencha todos os dados do cartão.',
        });
        return;
      }
    } else if (paymentMethod === 'cash') {
      if (cashReceived < calculateTotal()) {
        toast({
          title: 'Valor insuficiente',
          description: 'O valor em dinheiro deve ser maior ou igual ao total da compra.',
        });
        return;
      }
    } else if (paymentMethod === 'pix') {
      if (!pixKey) {
        toast({
          title: 'Chave PIX necessária',
          description: 'Informe a chave PIX para prosseguir.',
        });
        return;
      }
    }

    // Processar pagamento
    toast({
      title: 'Compra finalizada',
      description: `Pagamento de R$ ${calculateTotal().toFixed(2)} realizado com sucesso via ${
        paymentMethod === 'cash' ? 'Dinheiro' : 
        paymentMethod === 'card' ? 'Cartão' : 'PIX'
      }!`,
    });

    // Limpar dados após finalização
    setCart([]);
    setCustomerName('');
    setCustomerEmail('');
    setDiscount(0);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setCashReceived(0);
    setPixKey('');
    setShowPaymentModal(false);
  };

  const calculateChange = () => {
    return Math.max(0, cashReceived - calculateTotal());
  };

  return (
    <>
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

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* Imagem em formato 1:1 no topo */}
                      <div className="mb-4">
                        <AspectRatio ratio={1}>
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded border flex items-center justify-center">
                              <span className="text-gray-400 text-sm">Sem foto</span>
                            </div>
                          )}
                        </AspectRatio>
                      </div>

                      {/* Informações do produto abaixo da imagem */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        </div>
                        
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        
                        <div className="flex justify-between items-center">
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Cart and Customer Info */}
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
              <CardTitle>Resumo da Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount.toString()}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Desconto:</span>
                  <span>- R$ {((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Finalizar Compra
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total a pagar</p>
              <p className="text-2xl font-bold">R$ {calculateTotal().toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'pix') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      Dinheiro
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cartão
                    </div>
                  </SelectItem>
                  <SelectItem value="pix">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      PIX
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campos específicos para Cartão */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Nome como está no cartão"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input
                      id="cardCvv"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Campos específicos para Dinheiro */}
            {paymentMethod === 'cash' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="cashReceived">Valor Recebido</Label>
                  <Input
                    id="cashReceived"
                    type="number"
                    step="0.01"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                {cashReceived > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Troco:</span>
                      <span className="font-semibold">R$ {calculateChange().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Campos específicos para PIX */}
            {paymentMethod === 'pix' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input
                    id="pixKey"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="Digite sua chave PIX"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  Após informar a chave PIX, o cliente deverá realizar o pagamento através do aplicativo do banco.
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePaymentConfirm}>
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
