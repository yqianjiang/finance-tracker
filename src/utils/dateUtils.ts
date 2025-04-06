// 格式化当前日期为YYYY-MM-DD
export const formatCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 计算两个日期之间的天数
export const calculateDaysBetween = (startDate: string, endDate?: string): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  return Math.floor((end.getTime() - start.getTime()) / 86400000);
};

// 计算持有天数
export const calculateDaysHeld = (product: {
  purchaseDate: string;
  redeemed: boolean;
  redemptionDate?: string;
}): number => {
  if (!product) return 0;

  const endDate = product.redeemed && product.redemptionDate ? product.redemptionDate : formatCurrentDate();

  return calculateDaysBetween(product.purchaseDate, endDate);
};
