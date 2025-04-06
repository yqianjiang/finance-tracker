// 财务产品类型
export type FinancialProduct = {
  id: string;
  name: string;
  productCode: string; // 产品代码
  purchaseDate: string;
  purchaseNetValue: number;
  purchaseAmount: number; // 购买金额
  shares: number; // 持仓份额
  redeemed: boolean;
  redemptionDate?: string;
  monthlyYieldAtPurchase?: number; // 购买时的近1月年化
  inceptionYieldAtPurchase?: number; // 购买时的成立以来年化
  riskLevel: string; // 风险等级
  notes?: string; // 备注信息
};

// 查询记录类型
export type QueryRecord = {
  id: string;
  productId: string;
  queryDate: string;
  currentNetValue: number;
  currentAmount: number; // 当前金额
  annualizedYield: number;
  daysHeld: number;
};

// 风险等级选项
export const RISK_LEVELS = [
  { value: '', label: '选择风险等级' },
  { value: 'R1', label: 'R1 - 低风险' },
  { value: 'R2', label: 'R2 - 中低风险' },
  { value: 'R3', label: 'R3 - 中风险' },
  { value: 'R4', label: 'R4 - 中高风险' },
  { value: 'R5', label: 'R5 - 高风险' },
];
