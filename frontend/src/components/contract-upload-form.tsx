import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { useContract } from '@/lib/contract-context';
import { Progress } from './ui/progress';
import { useLanguage } from '@/lib/language-context';
import { translateComplianceLevel } from '@/lib/compliance-translation';

const ContractUploadForm = () => {
  const { language, translations } = useLanguage();
  const { 
    file, 
    contractType, 
    isAnalyzing, 
    uploadProgress, 
    error, 
    setFile, 
    setContractType, 
    analyzeContract 
  } = useContract();
  
  const [dragActive, setDragActive] = useState(false);
  
  // التعامل مع سحب وإفلات الملفات
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // التعامل مع إفلات الملف
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  // التعامل مع اختيار الملف
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  // التعامل مع تغيير نوع العقد
  const handleContractTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContractType(e.target.value as any);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur shadow-lg rounded-xl border border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* منطقة سحب وإفلات الملفات */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
            } transition-all duration-200 ease-in-out`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
              
              <div className="text-lg font-medium">
                {language === 'ar' ? 'اسحب وأفلت ملف العقد هنا' : 'Drag and drop your contract file here'}
              </div>
              
              <div className="text-sm text-gray-500">
                {language === 'ar' ? 'أو' : 'or'}
              </div>
              
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" type="button">
                    {language === 'ar' ? 'اختر ملفاً' : 'Browse files'}
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              
              <div className="text-xs text-gray-500">
                {language === 'ar' 
                  ? 'يدعم ملفات PDF و DOCX و TXT' 
                  : 'Supports PDF, DOCX, and TXT files'}
              </div>
            </div>
          </div>
          
          {/* عرض اسم الملف المختار */}
          {file && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <span className="font-medium">{file.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFile(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </Button>
            </div>
          )}
          
          {/* اختيار نوع العقد */}
          <div className="space-y-2">
            <Label htmlFor="contract-type">
              {language === 'ar' ? 'نوع العقد' : 'Contract Type'}
            </Label>
            <Select
              id="contract-type"
              value={contractType}
              onChange={handleContractTypeChange}
              disabled={isAnalyzing}
              className="w-full"
            >
              <option value="employment">
                {language === 'ar' ? 'عقد عمل' : 'Employment Contract'}
              </option>
              <option value="rental">
                {language === 'ar' ? 'عقد إيجار' : 'Rental Contract'}
              </option>
              <option value="sales">
                {language === 'ar' ? 'عقد بيع' : 'Sales Contract'}
              </option>
              <option value="partnership">
                {language === 'ar' ? 'عقد شراكة' : 'Partnership Contract'}
              </option>
            </Select>
          </div>
          
          {/* رسالة الخطأ */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* شريط التقدم */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {language === 'ar' ? 'جاري تحليل العقد...' : 'Analyzing contract...'}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {/* زر التحليل */}
          <Button 
            onClick={analyzeContract} 
            disabled={!file || isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing 
              ? (language === 'ar' ? 'جاري التحليل...' : 'Analyzing...') 
              : (language === 'ar' ? 'تحليل العقد' : 'Analyze Contract')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractUploadForm;
