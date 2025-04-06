import type React from 'react';
import type { FinancialProduct, QueryRecord } from '../types';

type QueryHistoryProps = {
  product: FinancialProduct;
  records: QueryRecord[];
  latestRecord: QueryRecord | null;
};

const QueryHistory: React.FC<QueryHistoryProps> = ({ product, records, latestRecord }) => {
  // 业绩对比计算
  const getPerformanceDifference = () => {
    if (!product.monthlyYieldAtPurchase || !latestRecord) return null;

    const difference = latestRecord.annualizedYield - product.monthlyYieldAtPurchase;
    return {
      value: difference.toFixed(2),
      isPositive: difference >= 0,
    };
  };

  const performanceDiff = getPerformanceDifference();

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-semibold text-xl">查询历史</h2>

      {/* 性能对比提示 */}
      {product.monthlyYieldAtPurchase !== undefined && records.length > 0 && (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <h3 className="mb-1 font-semibold text-sm">业绩对比</h3>
          <div className="text-sm">
            <div className="flex justify-between">
              <span>购买时近1月年化:</span>
              <span className={product.monthlyYieldAtPurchase >= 0 ? 'text-green-600' : 'text-red-600'}>
                {product.monthlyYieldAtPurchase}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>最新查询年化:</span>
              <span className={(latestRecord?.annualizedYield || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {latestRecord?.annualizedYield || 0}%
              </span>
            </div>
            {performanceDiff && (
              <div className="flex justify-between">
                <span>业绩差异:</span>
                <span className={performanceDiff.isPositive ? 'text-green-600' : 'text-red-600'}>
                  {performanceDiff.value}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 查询记录 */}
      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="py-4 text-center text-gray-500">暂无查询记录</p>
        ) : (
          records.map((record) => (
            <div key={record.id} className="rounded-md bg-gray-50 p-4">
              <div className="mb-2 flex justify-between">
                <span className="font-medium">{record.queryDate}</span>
                <span className={record.annualizedYield >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {record.annualizedYield}%
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                净值: {record.currentNetValue} • 持有天数: {record.daysHeld}天
              </div>
              {record.currentAmount && (
                <div className="mt-1 text-gray-600 text-sm">
                  <div>
                    持仓金额: {record.currentAmount.toFixed(2)}元 (成本: {product.purchaseAmount}元)
                  </div>
                  {record.daysHeld > 0 && (
                    <div>
                      平均每天收益: {((record.currentAmount - product.purchaseAmount) / record.daysHeld).toFixed(2)}元
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueryHistory;
