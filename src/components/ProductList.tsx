import type React from 'react';
import type { FinancialProduct, QueryRecord } from '../types';
import { calculateDaysHeld } from '../utils/dateUtils';

type ProductListProps = {
  products: FinancialProduct[];
  records: QueryRecord[];
  showRedeemed: boolean;
  setShowRedeemed: (show: boolean) => void;
  selectedProduct: string;
  setSelectedProduct: (id: string) => void;
  setShowAddProductForm: (show: boolean) => void;
  getLatestRecord: (productId: string) => QueryRecord | null;
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  showRedeemed,
  setShowRedeemed,
  selectedProduct,
  setSelectedProduct,
  setShowAddProductForm,
  getLatestRecord,
}) => {
  // 过滤产品列表
  const filteredProducts = showRedeemed ? products : products.filter((product) => !product.redeemed);

  // 按年化利率从低到高排序
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const recordA = getLatestRecord(a.id);
    const recordB = getLatestRecord(b.id);

    // 如果没有记录，放在末尾
    if (!recordA) return 1;
    if (!recordB) return -1;

    // 按年化利率从低到高排序
    return recordA.annualizedYield - recordB.annualizedYield;
  });

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="font-semibold text-lg sm:text-xl">理财产品看板</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowRedeemed(!showRedeemed)}
            className="rounded-full bg-gray-200 px-2 py-1 text-xs transition hover:bg-gray-300 sm:px-3 sm:text-sm"
          >
            {showRedeemed ? '隐藏已赎回' : '显示已赎回'}
          </button>
          <button
            onClick={() => setShowAddProductForm(true)}
            className="rounded-full bg-blue-500 px-2 py-1 text-white text-xs transition hover:bg-blue-600 sm:px-3 sm:text-sm"
          >
            新增产品
          </button>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="py-4 text-center text-gray-500">{products.length === 0 ? '暂无理财产品' : '没有未赎回的产品'}</p>
      ) : (
        <div className="space-y-3">
          {sortedProducts.map((product) => {
            const latestRecord = getLatestRecord(product.id);

            return (
              <div
                key={product.id}
                className={`cursor-pointer rounded-md border p-3 sm:p-4 ${
                  selectedProduct === product.id
                    ? 'border-blue-500 bg-blue-50'
                    : product.redeemed
                      ? 'border-gray-200 bg-gray-100'
                      : 'border-gray-200 bg-gray-50'
                } transition hover:bg-gray-100`}
                onClick={() => setSelectedProduct(product.id)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{product.name}</span>
                    {product.redeemed && (
                      <span className="w-fit rounded-full bg-gray-200 px-2 py-0.5 text-gray-700 text-xs">已赎回</span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{product.productCode}</span>
                    <span
                      className={`text-xs ${latestRecord ? (latestRecord.annualizedYield >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-500'}`}
                    >
                      {latestRecord ? `${latestRecord.annualizedYield}%` : '未查询'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex flex-row justify-between text-gray-600 text-xs sm:text-sm">
                  <span>购买净值: {product.purchaseNetValue}</span>
                  <span>持有天数: {calculateDaysHeld(product)}天</span>
                </div>
                {latestRecord && (
                  <div className="mt-1 flex flex-row justify-between text-gray-600 text-xs sm:text-sm">
                    <span>持仓金额: {latestRecord.currentAmount.toFixed(2)}元</span>
                    <span>
                      日均收益:{' '}
                      {((latestRecord.currentAmount - product.purchaseAmount) / calculateDaysHeld(product)).toFixed(2)}
                      元
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
