
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: number;
  categoriesCount: number;
  recentProducts: Product[];
}
