import { useEffect, useState } from 'react';
import type { FinancialProduct } from '../types';
import { formatCurrentDate } from '../utils/dateUtils';

export const useFinancialProducts = () => {
  const [products, setProducts] = useState<FinancialProduct[]>([]);

  // 初始化加载数据
  useEffect(() => {
    const savedProducts = localStorage.getItem('financialProducts');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  // 保存产品到localStorage
  const saveProductsToStorage = (updatedProducts: FinancialProduct[]) => {
    localStorage.setItem('financialProducts', JSON.stringify(updatedProducts));
    return updatedProducts;
  };

  // 添加产品
  const addProduct = (productData: Omit<FinancialProduct, 'id'>) => {
    const newProduct: FinancialProduct = {
      id: crypto.randomUUID(),
      ...productData,
      redeemed: false,
    };
    const updatedProducts = [...products, newProduct];
    setProducts(saveProductsToStorage(updatedProducts));
    return newProduct;
  };

  // 更新产品信息
  const updateProduct = (id: string, updates: Partial<FinancialProduct>) => {
    const updatedProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product));
    setProducts(saveProductsToStorage(updatedProducts));
  };

  // 删除产品
  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(saveProductsToStorage(updatedProducts));
    return updatedProducts;
  };

  // 切换赎回状态
  const toggleRedeemStatus = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const isRedeemed = !product.redeemed;
    const updates: Partial<FinancialProduct> = {
      redeemed: isRedeemed,
      redemptionDate: isRedeemed ? formatCurrentDate() : undefined,
    };

    updateProduct(id, updates);
  };

  // 导入产品数据
  const importProducts = (newProducts: FinancialProduct[]) => {
    setProducts(newProducts);
    localStorage.setItem('financialProducts', JSON.stringify(newProducts));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleRedeemStatus,
    importProducts, // 添加导入方法
  };
};
