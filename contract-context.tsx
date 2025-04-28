"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type ContractType = 'employment' | 'rental' | 'sales' | 'partnership';

interface AnalysisResult {
  contract_type: ContractType;
  compliance_score: number;
  violations: {
    rule: string;
    description: string;
    risk_level: 'high' | 'medium' | 'low';
    reference: string;
  }[];
  missing_clauses: {
    clause: string;
    description: string;
    risk_level: 'high' | 'medium' | 'low';
  }[];
  risks: {
    rule: string;
    description: string;
    risk_level: 'high' | 'medium' | 'low';
    reference: string;
  }[];
  recommendations: string[];
}

interface ContractContextType {
  file: File | null;
  contractType: ContractType;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  setFile: (file: File | null) => void;
  setContractType: (type: ContractType) => void;
  analyzeContract: () => void;
  resetAnalysis: () => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

// Sample analysis results for demonstration
const sampleResults: Record<ContractType, AnalysisResult> = {
  employment: {
    contract_type: 'employment',
    compliance_score: 60,
    violations: [
      {
        rule: 'الحد الأقصى لساعات العمل',
        description: 'يتجاوز العقد الحد الأقصى القانوني لساعات العمل (48 ساعة في الأسبوع) بتحديد 54 ساعة أسبوعياً',
        risk_level: 'high',
        reference: 'نظام العمل السعودي، المادة 98'
      },
      {
        rule: 'مدة فترة التجربة',
        description: 'فترة التجربة المحددة (6 أشهر) تتجاوز الحد الأقصى المسموح به قانونياً (90 يوماً)',
        risk_level: 'medium',
        reference: 'نظام العمل السعودي، المادة 53'
      }
    ],
    missing_clauses: [
      {
        clause: 'بند الإجازة السنوية',
        description: 'يجب أن يتضمن العقد تفاصيل الإجازة السنوية المدفوعة وفقاً للقانون',
        risk_level: 'medium'
      },
      {
        clause: 'التأمين الطبي',
        description: 'يجب أن يتضمن العقد بنداً يوضح تغطية التأمين الطبي للموظف',
        risk_level: 'medium'
      }
    ],
    risks: [
      {
        rule: 'شرط عدم المنافسة',
        description: 'مدة شرط عدم المنافسة (3 سنوات) طويلة جداً وقد تعتبر غير قابلة للتنفيذ',
        risk_level: 'medium',
        reference: 'نظام العمل السعودي، المادة 83'
      }
    ],
    recommendations: [
      'تعديل ساعات العمل الأسبوعية لتكون 48 ساعة كحد أقصى',
      'تقليل فترة التجربة إلى 90 يوماً',
      'إضافة بند يوضح تفاصيل الإجازة السنوية المدفوعة',
      'إضافة بند يوضح تغطية التأمين الطبي',
      'تقليل مدة شرط عدم المنافسة إلى سنة واحدة كحد أقصى'
    ]
  },
  rental: {
    contract_type: 'rental',
    compliance_score: 80,
    violations: [
      {
        rule: 'نسبة مبلغ التأمين',
        description: 'مبلغ التأمين المحدد (شهرين) يتجاوز الحد الأقصى المسموح به (شهر واحد)',
        risk_level: 'medium',
        reference: 'أنظمة إيجار، المادة 12'
      }
    ],
    missing_clauses: [
      {
        clause: 'آلية فض المنازعات',
        description: 'يجب أن يتضمن العقد آلية واضحة لفض المنازعات بين المؤجر والمستأجر',
        risk_level: 'low'
      }
    ],
    risks: [
      {
        rule: 'شرط التجديد التلقائي',
        description: 'شرط التجديد التلقائي غير محدد المدة قد يكون غير قابل للتنفيذ',
        risk_level: 'low',
        reference: 'أنظمة إيجار، المادة 25'
      }
    ],
    recommendations: [
      'تعديل مبلغ التأمين ليكون شهراً واحداً',
      'إضافة بند يوضح آلية فض المنازعات',
      'تحديد مدة محددة للتجديد التلقائي (مثل سنة واحدة)'
    ]
  },
  sales: {
    contract_type: 'sales',
    compliance_score: 92,
    violations: [],
    missing_clauses: [
      {
        clause: 'تفاصيل التسجيل الضريبي',
        description: 'يجب أن يتضمن العقد رقم التسجيل الضريبي للبائع',
        risk_level: 'low'
      }
    ],
    risks: [
      {
        rule: 'شروط الضمان',
        description: 'شروط الضمان غير محددة بوضوح وقد تتعارض مع حقوق المستهلك',
        risk_level: 'low',
        reference: 'نظام حماية المستهلك، المادة 14'
      }
    ],
    recommendations: [
      'إضافة رقم التسجيل الضريبي للبائع',
      'توضيح شروط الضمان بشكل أكثر تفصيلاً'
    ]
  },
  partnership: {
    contract_type: 'partnership',
    compliance_score: 90,
    violations: [],
    missing_clauses: [
      {
        clause: 'آلية تسوية الخلافات',
        description: 'يجب أن يتضمن العقد آلية واضحة لتسوية الخلافات بين الشركاء',
        risk_level: 'medium'
      }
    ],
    risks: [
      {
        rule: 'توزيع الأرباح',
        description: 'آلية توزيع الأرباح غير محددة بوضوح وقد تؤدي إلى نزاعات مستقبلية',
        risk_level: 'medium',
        reference: 'نظام الشركات، المادة 9'
      }
    ],
    recommendations: [
      'إضافة بند يوضح آلية تسوية الخلافات بين الشركاء',
      'تحديد آلية توزيع الأرباح بشكل أكثر تفصيلاً ووضوحاً'
    ]
  }
};

export function ContractProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [contractType, setContractType] = useState<ContractType>('employment');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyzeContract = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setAnalysisResult(sampleResults[contractType]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
  };

  return (
    <ContractContext.Provider
      value={{
        file,
        contractType,
        isAnalyzing,
        analysisResult,
        setFile,
        setContractType,
        analyzeContract,
        resetAnalysis
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}
