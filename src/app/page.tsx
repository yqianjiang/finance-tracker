'use client';

import DataImportExport from '@/components/DataImportExport';
import ProductDetail from '@/components/ProductDetail';
import ProductForm from '@/components/ProductForm';
import ProductList from '@/components/ProductList';
import QueryForm from '@/components/QueryForm';
import QueryHistory from '@/components/QueryHistory';
import { useFinancialProducts } from '@/hooks/useFinancialProducts';
import { useQueryRecords } from '@/hooks/useQueryRecords';
import type { FinancialProduct, QueryRecord } from '@/types';
import { useState } from 'react';

export default function FinanceTracker() {
  // 使用自定义Hook管理产品和记录
  const { products, addProduct, updateProduct, deleteProduct, toggleRedeemStatus, importProducts } =
    useFinancialProducts();

  const { records, addRecord, getProductRecords, getLatestRecord, importRecords } = useQueryRecords();

  // UI状态管理
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showRedeemed, setShowRedeemed] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // 当前选中产品对象
  const selectedProductData = products.find((p) => p.id === selectedProduct);

  // 处理数据导入
  const handleImportData = (data: { products: FinancialProduct[]; records: QueryRecord[] }) => {
    importProducts(data.products);
    importRecords(data.records);
    // 清除选择的产品，避免导入后可能的ID不匹配问题
    setSelectedProduct('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* 数据导入导出 */}
        <DataImportExport products={products} records={records} importData={handleImportData} />

        {/* 产品看板 */}
        <ProductList
          products={products}
          records={records}
          showRedeemed={showRedeemed}
          setShowRedeemed={setShowRedeemed}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          setShowAddProductForm={setShowAddProductForm}
          getLatestRecord={getLatestRecord}
        />

        {/* 产品录入表单 */}
        {showAddProductForm && <ProductForm onSubmit={addProduct} onCancel={() => setShowAddProductForm(false)} />}

        {/* 产品详情 */}
        {selectedProduct && selectedProductData && (
          <ProductDetail
            product={selectedProductData}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            toggleRedeemStatus={toggleRedeemStatus}
            onDeleteComplete={() => setSelectedProduct('')}
          />
        )}

        {/* 收益查询 */}
        {selectedProduct && <QueryForm productId={selectedProduct} onSubmit={addRecord} />}

        {/* 历史记录 */}
        {selectedProduct && selectedProductData && (
          <QueryHistory
            product={selectedProductData}
            records={getProductRecords(selectedProduct)}
            latestRecord={getLatestRecord(selectedProduct)}
          />
        )}
      </div>
    </div>
  );
}
