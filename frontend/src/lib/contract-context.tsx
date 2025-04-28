// تعديل ملف contract-context.tsx لدمجه مع الواجهة الخلفية

import React, { createContext, useContext, useState, ReactNode } from 'react';

// تعريف أنواع البيانات
export type ContractType = 'employment' | 'rental' | 'sales' | 'partnership';

export interface AnalysisResult {
  file_id: string;
  contract_type: string;
  compliance_score: number;
  compliance_level: string;
  analysis_date: string;
  issues: Array<{
    severity: string;
    description: string;
    recommendation: string;
    reference: string;
  }>;
  missing_clauses: Array<{
    importance: string;
    description: string;
    recommendation: string;
  }>;
  compliant_clauses: Array<{
    description: string;
    reference: string;
  }>;
}

interface ContractContextType {
  file: File | null;
  contractType: ContractType;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  uploadProgress: number;
  error: string | null;
  setFile: (file: File | null) => void;
  setContractType: (type: ContractType) => void;
  analyzeContract: () => Promise<void>;
  resetAnalysis: () => void;
}

// إنشاء السياق
const ContractContext = createContext<ContractContextType | undefined>(undefined);

// مزود السياق
export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [contractType, setContractType] = useState<ContractType>('employment');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // عنوان API الخلفية
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const analyzeContract = async () => {
    if (!file || !contractType) {
      setError('الرجاء اختيار ملف وتحديد نوع العقد');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);

    try {
      // إنشاء نموذج البيانات للرفع
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contract_type', contractType);

      // محاكاة تقدم الرفع
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // رفع الملف وتحليله
      const response = await fetch(`${API_URL}/upload-contract/`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'حدث خطأ أثناء تحليل العقد');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis_result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <ContractContext.Provider
      value={{
        file,
        contractType,
        isAnalyzing,
        analysisResult,
        uploadProgress,
        error,
        setFile,
        setContractType,
        analyzeContract,
        resetAnalysis,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

// هوك استخدام السياق
export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
