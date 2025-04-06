'use client';

import type { FinancialProduct, QueryRecord } from '@/types';
import { ChevronDown, ChevronUp, Download, Upload } from 'lucide-react';
import { useState } from 'react';

interface DataImportExportProps {
  products: FinancialProduct[];
  records: QueryRecord[];
  importData: (data: { products: FinancialProduct[]; records: QueryRecord[] }) => void;
}

export default function DataImportExport({ products, records, importData }: DataImportExportProps) {
  const [importError, setImportError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 导出数据为JSON文件
  const handleExport = () => {
    const data = { products, records };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `理财产品信息-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导入JSON数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // 简单验证导入的数据结构
        if (!data.products || !Array.isArray(data.products) || !data.records || !Array.isArray(data.records)) {
          throw new Error('导入的文件格式不正确');
        }

        importData(data);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : '导入失败');
      }
    };
    reader.readAsText(file);

    // 重置文件输入，以便可以重新选择同一文件
    event.target.value = '';
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setImportError(null); // 展开时清除错误信息
    }
  };

  return (
    <div className="mb-4 rounded bg-white p-4 shadow">
      <div className="flex cursor-pointer items-center justify-between" onClick={toggleExpanded}>
        <h2 className="font-medium text-lg">数据同步</h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center rounded bg-blue-500 px-3 py-2 text-white transition-colors hover:bg-blue-600"
            >
              <Download className="mr-1 h-4 w-4" />
              <span>导出数据</span>
            </button>

            <label className="flex cursor-pointer items-center rounded bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-600">
              <Upload className="mr-1 h-4 w-4" />
              <span>导入数据</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          {importError && <p className="mt-2 text-red-500 text-sm">{importError}</p>}
        </div>
      )}
    </div>
  );
}
