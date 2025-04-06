import { useEffect, useState } from 'react';
import type { QueryRecord } from '../types';
import { calculateDaysBetween } from '../utils/dateUtils';

export const useQueryRecords = () => {
  const [records, setRecords] = useState<QueryRecord[]>([]);

  // 初始化加载数据
  useEffect(() => {
    const savedRecords = localStorage.getItem('queryRecords');
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  // 保存记录到localStorage
  const saveRecordsToStorage = (updatedRecords: QueryRecord[]) => {
    localStorage.setItem('queryRecords', JSON.stringify(updatedRecords));
    return updatedRecords;
  };

  // 添加查询记录
  const addRecord = (
    productId: string,
    purchaseDate: string,
    queryDate: string,
    currentNetValue: number,
    purchaseNetValue: number,
    shares: number,
  ) => {
    const daysHeld = calculateDaysBetween(purchaseDate, queryDate);

    const annualizedYield = Number(
      (((currentNetValue - purchaseNetValue) / purchaseNetValue) * (365 / Math.max(daysHeld, 1)) * 100).toFixed(2),
    );

    const newRecord: QueryRecord = {
      id: crypto.randomUUID(),
      productId,
      queryDate,
      currentNetValue,
      annualizedYield,
      daysHeld,
      currentAmount: currentNetValue * shares, // 当前金额 = 当前净值 * product.shares
    };

    const updatedRecords = [...records, newRecord];
    setRecords(saveRecordsToStorage(updatedRecords));
    return newRecord;
  };

  // 获取产品相关的查询记录
  const getProductRecords = (productId: string): QueryRecord[] => {
    return records.filter((record) => record.productId === productId);
  };

  // 获取产品最新的查询记录
  const getLatestRecord = (productId: string): QueryRecord | null => {
    const productRecords = getProductRecords(productId);
    if (productRecords.length === 0) return null;

    return productRecords.reduce((latest, current) => {
      return new Date(current.queryDate) > new Date(latest.queryDate) ? current : latest;
    }, productRecords[0]);
  };

  // 删除产品相关的所有记录
  const deleteProductRecords = (productId: string) => {
    const updatedRecords = records.filter((record) => record.productId !== productId);
    setRecords(saveRecordsToStorage(updatedRecords));
  };

  // 导入记录数据
  const importRecords = (newRecords: QueryRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('queryRecords', JSON.stringify(newRecords));
  };

  return {
    records,
    addRecord,
    getProductRecords,
    getLatestRecord,
    deleteProductRecords,
    importRecords, // 添加导入方法
  };
};
