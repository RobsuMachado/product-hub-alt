
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, DashboardStats } from '@/types/product';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  stats: DashboardStats;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  searchProducts: (query: string) => Product[];
  filterByCategory: (category: string) => Product[];
  refreshStats: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Eletrônicos', description: 'Produtos eletrônicos', color: '#3B82F6' },
    { id: '2', name: 'Roupas', description: 'Vestuário e acessórios', color: '#EF4444' },
    { id: '3', name: 'Casa', description: 'Itens para casa', color: '#10B981' },
    { id: '4', name: 'Esportes', description: 'Artigos esportivos', color: '#F59E0B' },
  ]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    categoriesCount: 0,
    recentProducts: [],
  });

  // Dados de exemplo
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'Smartphone Apple com chip A17 Pro',
        category: 'Eletrônicos',
        costPrice: 800,
        salePrice: 1200,
        stock: 15,
        sku: 'IPH15PRO001',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Camiseta Polo',
        description: 'Camiseta polo masculina de algodão',
        category: 'Roupas',
        costPrice: 25,
        salePrice: 49.99,
        stock: 3,
        sku: 'CAM001',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: '3',
        name: 'Mesa de Centro',
        description: 'Mesa de centro em madeira maciça',
        category: 'Casa',
        costPrice: 150,
        salePrice: 299.99,
        stock: 8,
        sku: 'MES001',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        id: '4',
        name: 'Tênis de Corrida',
        description: 'Tênis para corrida com tecnologia de amortecimento',
        category: 'Esportes',
        costPrice: 80,
        salePrice: 159.99,
        stock: 1,
        sku: 'TEN001',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
    ];
    setProducts(sampleProducts);
  }, []);

  const refreshStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.salePrice * product.stock), 0);
    const lowStockProducts = products.filter(product => product.stock <= 5).length;
    const categoriesCount = categories.length;
    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    setStats({
      totalProducts,
      totalValue,
      lowStockProducts,
      categoriesCount,
      recentProducts,
    });
  };

  useEffect(() => {
    refreshStats();
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const searchProducts = (query: string) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        stats,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        searchProducts,
        filterByCategory,
        refreshStats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
