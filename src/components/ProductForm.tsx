import type React from 'react';
import { type FinancialProduct, RISK_LEVELS } from '../types';

type ProductFormProps = {
  onSubmit: (product: Omit<FinancialProduct, 'id'>) => void;
  onCancel: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newProduct: Omit<FinancialProduct, 'id'> = {
      name: formData.get('productName') as string,
      productCode: formData.get('productCode') as string,
      purchaseDate: formData.get('purchaseDate') as string,
      purchaseNetValue: Number.parseFloat(formData.get('purchaseNetValue') as string),
      purchaseAmount: Number.parseFloat(formData.get('purchaseAmount') as string),
      redeemed: false,
      monthlyYieldAtPurchase: formData.get('monthlyYieldAtPurchase')
        ? Number.parseFloat(formData.get('monthlyYieldAtPurchase') as string)
        : undefined,
      inceptionYieldAtPurchase: formData.get('inceptionYieldAtPurchase')
        ? Number.parseFloat(formData.get('inceptionYieldAtPurchase') as string)
        : undefined,
      riskLevel: formData.get('riskLevel') as string,
      notes: (formData.get('productNotes') as string) || undefined,
      shares: 0,
    };

    newProduct.shares = newProduct.purchaseAmount / newProduct.purchaseNetValue;

    onSubmit(newProduct);
    e.currentTarget.reset();
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-xl">新增理财产品</h2>
        <button onClick={onCancel} className="rounded-full bg-gray-200 px-3 py-1 text-sm transition hover:bg-gray-300">
          取消
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="productName"
          placeholder="产品名称"
          required
          className="w-full rounded-md border p-2"
        />
        <input type="text" name="productCode" placeholder="产品代码" className="w-full rounded-md border p-2" />
        <input type="date" name="purchaseDate" required className="w-full rounded-md border p-2" />
        <input
          type="number"
          step="0.00001"
          name="purchaseNetValue"
          placeholder="购买净值"
          required
          className="w-full rounded-md border p-2"
        />
        <input
          type="number"
          step="0.01"
          name="purchaseAmount"
          placeholder="购买金额"
          className="w-full rounded-md border p-2"
        />
        <input
          type="number"
          step="0.01"
          name="monthlyYieldAtPurchase"
          placeholder="购买时近1月年化(%)"
          className="w-full rounded-md border p-2"
        />
        <input
          type="number"
          step="0.01"
          name="inceptionYieldAtPurchase"
          placeholder="购买时成立以来年化(%)"
          className="w-full rounded-md border p-2"
        />
        <select name="riskLevel" className="w-full rounded-md border p-2">
          {RISK_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        <textarea name="productNotes" placeholder="产品备注" className="w-full rounded-md border p-2" rows={3} />
        <button type="submit" className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600">
          保存产品
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
