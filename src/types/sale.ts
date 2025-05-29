
export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  salePrice: number;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'pix';
  customerName?: string;
  customerEmail?: string;
  status: 'completed' | 'cancelled';
  createdAt: Date;
}
