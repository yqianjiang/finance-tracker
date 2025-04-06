import { ChevronDown, ChevronUp, Edit, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { type FinancialProduct, RISK_LEVELS } from '../types';
import { calculateDaysHeld } from '../utils/dateUtils';

type ProductDetailProps = {
  product: FinancialProduct;
  updateProduct: (id: string, updates: Partial<FinancialProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleRedeemStatus: (id: string) => void;
  onDeleteComplete: () => void;
};

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  updateProduct,
  deleteProduct,
  toggleRedeemStatus,
  onDeleteComplete,
}) => {
  // 折叠状态
  const [isExpanded, setIsExpanded] = useState(false);

  // 编辑状态
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAssistInfo, setIsEditingAssistInfo] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // 编辑字段
  const [editedName, setEditedName] = useState(product.name);
  const [editedMonthlyYield, setEditedMonthlyYield] = useState(product.monthlyYieldAtPurchase?.toString() || '');
  const [editedInceptionYield, setEditedInceptionYield] = useState(product.inceptionYieldAtPurchase?.toString() || '');
  const [editedRiskLevel, setEditedRiskLevel] = useState(product.riskLevel || '');
  const [editedNotes, setEditedNotes] = useState(product.notes || '');

  // 切换折叠状态
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 保存产品名称
  const handleSaveProductName = () => {
    if (editedName.trim() === '') {
      alert('产品名称不能为空');
      return;
    }
    updateProduct(product.id, { name: editedName });
    setIsEditingName(false);
    setEditedName('');
  };

  // 保存决策辅助信息
  const handleSaveAssistInfo = () => {
    if (editedMonthlyYield && Number.isNaN(Number.parseFloat(editedMonthlyYield))) {
      alert('近1月年化必须是有效数字');
      return;
    }

    updateProduct(product.id, {
      monthlyYieldAtPurchase: editedMonthlyYield ? Number.parseFloat(editedMonthlyYield) : undefined,
      inceptionYieldAtPurchase: editedInceptionYield ? Number.parseFloat(editedInceptionYield) : undefined,
      riskLevel: editedRiskLevel || undefined,
    });

    setIsEditingAssistInfo(false);
  };

  // 保存备注
  const handleSaveNotes = () => {
    updateProduct(product.id, { notes: editedNotes || undefined });
    setIsEditingNotes(false);
  };

  // 处理删除产品
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除此产品及其所有记录吗？')) {
      deleteProduct(product.id);
      onDeleteComplete();
    }
  };

  // 处理赎回状态
  const handleRedemptionToggle = () => {
    if (product.redeemed) {
      if (window.confirm('确定要取消该产品的赎回状态吗？')) {
        toggleRedeemStatus(product.id);
      }
    } else {
      if (window.confirm('确定要标记该产品为已全部赎回吗？')) {
        toggleRedeemStatus(product.id);
      }
    }
  };

  // 定义基础信息字段
  const fields = [
    { label: '产品代码', value: product.productCode || <span className="text-gray-400">暂无</span> },
    { label: '购买日期', value: product.purchaseDate },
    { label: '持仓成本价', value: product.purchaseNetValue },
    {
      label: '持仓成本',
      value: product.purchaseAmount ? (
        `¥${product.purchaseAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ) : (
        <span className="text-gray-400">暂无</span>
      ),
    },
    { label: '持仓份额', value: `${product.shares.toFixed(2)} 份` },
    { label: '持有天数', value: calculateDaysHeld(product) },
    { label: '赎回状态', value: product.redeemed ? '已赎回' : '未赎回' },
  ];

  // 如果产品已赎回，添加赎回日期字段
  if (product.redeemed && product.redemptionDate) {
    fields.push({ label: '赎回日期', value: product.redemptionDate });
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {/* 可点击的标题栏 */}
      <div className="flex cursor-pointer items-center justify-between" onClick={toggleExpand}>
        <div className="flex items-center">
          <h2 className="font-semibold text-lg">产品详情</h2>
          <span className={`ml-3 text-sm ${product.redeemed ? 'text-gray-500' : 'text-green-600'}`}>
            {product.redeemed ? '已赎回' : '持有中'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {/* 展开后显示详细内容 */}
      {isExpanded && (
        <div className="mt-4 space-y-3 text-sm">
          {/* 基本信息 */}
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 font-medium">产品名称:</div>
              {isEditingName ? (
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="rounded-md border p-2"
                  />
                  <button
                    onClick={handleSaveProductName}
                    className="rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="rounded-md bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="col-span-2 flex items-center space-x-2">
                  <span>{product.name}</span>
                  <button
                    onClick={() => {
                      setIsEditingName(true);
                      setEditedName(product.name);
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* 使用映射方式显示产品信息 */}
              {fields.map((field, index) => (
                <React.Fragment key={index}>
                  <div className="col-span-1 font-medium">{field.label}:</div>
                  <div className="col-span-2">{field.value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 决策辅助信息 */}
          {!isEditingAssistInfo && (
            <div className="mt-4 rounded-md bg-gray-100 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold">决策辅助信息:</span>
                  {product.monthlyYieldAtPurchase !== undefined ? (
                    <>
                      购买时近1月年化 {product.monthlyYieldAtPurchase}% | 成立以来年化{' '}
                      {product.inceptionYieldAtPurchase ?? '未记录'}% | 风险等级 {product.riskLevel ?? '未设置'}
                    </>
                  ) : (
                    <>暂无</>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditedMonthlyYield(product.monthlyYieldAtPurchase?.toString() || '');
                    setEditedInceptionYield(product.inceptionYieldAtPurchase?.toString() || '');
                    setEditedRiskLevel(product.riskLevel || '');
                    setIsEditingAssistInfo(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {product.monthlyYieldAtPurchase !== undefined ? (
                    <Edit className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 编辑决策辅助信息 */}
          {isEditingAssistInfo && (
            <div className="mt-3 rounded-md border border-gray-200 p-3">
              <h3 className="mb-2 font-medium text-sm">
                {product.monthlyYieldAtPurchase !== undefined ? '编辑' : '添加'}决策辅助信息
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-gray-600 text-sm">购买时近1月年化(%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedMonthlyYield}
                    onChange={(e) => setEditedMonthlyYield(e.target.value)}
                    className="w-full rounded-md border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-600 text-sm">购买时成立以来年化(%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedInceptionYield}
                    onChange={(e) => setEditedInceptionYield(e.target.value)}
                    className="w-full rounded-md border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-600 text-sm">风险等级</label>
                  <select
                    value={editedRiskLevel}
                    onChange={(e) => setEditedRiskLevel(e.target.value)}
                    className="w-full rounded-md border p-2"
                  >
                    {RISK_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleSaveAssistInfo}
                    className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditingAssistInfo(false)}
                    className="rounded-md bg-gray-300 px-3 py-1 text-gray-700 text-sm hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 备注区域 */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">备注:</div>
              {!isEditingNotes && (
                <button
                  onClick={() => {
                    setEditedNotes(product.notes || '');
                    setIsEditingNotes(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {product.notes ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="mt-1">
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full rounded-md border p-2"
                  rows={3}
                />
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleSaveNotes}
                    className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    保存备注
                  </button>
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="rounded-md bg-gray-300 px-3 py-1 text-gray-700 text-sm hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1 rounded bg-gray-50 p-2">
                {product.notes || <span className="text-gray-400">暂无备注</span>}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleRedemptionToggle}
              className={`${
                product.redeemed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
              } rounded-md px-3 py-1 text-white`}
            >
              {product.redeemed ? '取消赎回状态' : '标记为已赎回'}
            </button>

            <button onClick={handleDelete} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              删除产品
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
