import type React from 'react';
import { formatCurrentDate } from '../utils/dateUtils';

type QueryFormProps = {
  productId: string;
  onSubmit: (
    productId: string,
    purchaseDate: string,
    queryDate: string,
    currentNetValue: number,
    purchaseNetValue: number,
    shares: number,
  ) => void;
};

const QueryForm: React.FC<QueryFormProps> = ({ productId, onSubmit }) => {
  // 从localStorage获取产品信息
  const getProductData = () => {
    const savedProducts = localStorage.getItem('financialProducts');
    if (!savedProducts) return null;

    const products = JSON.parse(savedProducts);
    return products.find((p: any) => p.id === productId);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product = getProductData();
    if (!product) {
      alert('无法找到产品信息');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const queryDate = formData.get('queryDate') as string;
    const currentNetValue = Number.parseFloat(formData.get('currentNetValue') as string);

    onSubmit(productId, product.purchaseDate, queryDate, currentNetValue, product.purchaseNetValue, product.shares);

    e.currentTarget.reset();
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-semibold text-xl">收益查询</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="date"
          name="queryDate"
          defaultValue={formatCurrentDate()}
          required
          className="w-full rounded-md border p-2"
        />
        <input
          type="number"
          step="0.00001"
          name="currentNetValue"
          placeholder="当前净值"
          required
          className="w-full rounded-md border p-2"
        />
        <button type="submit" className="w-full rounded-md bg-green-500 p-2 text-white hover:bg-green-600">
          计算年化收益率
        </button>
      </form>
    </div>
  );
};

export default QueryForm;
