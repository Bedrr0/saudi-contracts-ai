import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useContract } from '@/lib/contract-context';
import { useLanguage } from '@/lib/language-context';
import { translateComplianceLevel } from '@/lib/compliance-translation';

const AnalysisResults = () => {
  const { language } = useLanguage();
  const { analysisResult, resetAnalysis } = useContract();

  if (!analysisResult) return null;

  // ترجمة مستوى الامتثال
  const translatedComplianceLevel = translateComplianceLevel(analysisResult.compliance_level, language);

  // تحديد لون شارة مستوى الامتثال
  const getComplianceBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-400';
    if (score >= 60) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // تحديد لون شارة شدة المشكلة
  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-400';
      case 'low':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
    }
  };

  // ترجمة شدة المشكلة
  const translateSeverity = (severity: string) => {
    if (language === 'ar') {
      switch (severity) {
        case 'high':
          return 'عالية';
        case 'medium':
          return 'متوسطة';
        case 'low':
          return 'منخفضة';
        default:
          return severity;
      }
    }
    return severity;
  };

  // ترجمة أهمية البند
  const translateImportance = (importance: string) => {
    if (language === 'ar') {
      switch (importance) {
        case 'high':
          return 'عالية';
        case 'medium':
          return 'متوسطة';
        case 'low':
          return 'منخفضة';
        default:
          return importance;
      }
    }
    return importance;
  };

  return (
    <div className="space-y-6">
      {/* بطاقة ملخص التحليل */}
      <Card className="bg-white/90 backdrop-blur shadow-lg border border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              {language === 'ar' ? 'نتائج تحليل العقد' : 'Contract Analysis Results'}
            </CardTitle>
            <button
              onClick={resetAnalysis}
              className="text-gray-500 hover:text-primary transition-colors"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  {language === 'ar' ? 'نوع العقد' : 'Contract Type'}
                </div>
                <div className="font-medium">
                  {language === 'ar'
                    ? analysisResult.contract_type === 'employment'
                      ? 'عقد عمل'
                      : analysisResult.contract_type === 'rental'
                      ? 'عقد إيجار'
                      : analysisResult.contract_type === 'sales'
                      ? 'عقد بيع'
                      : analysisResult.contract_type === 'partnership'
                      ? 'عقد شراكة'
                      : analysisResult.contract_type
                    : analysisResult.contract_type === 'employment'
                    ? 'Employment Contract'
                    : analysisResult.contract_type === 'rental'
                    ? 'Rental Contract'
                    : analysisResult.contract_type === 'sales'
                    ? 'Sales Contract'
                    : analysisResult.contract_type === 'partnership'
                    ? 'Partnership Contract'
                    : analysisResult.contract_type}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  {language === 'ar' ? 'تاريخ التحليل' : 'Analysis Date'}
                </div>
                <div className="font-medium">
                  {new Date(analysisResult.analysis_date).toLocaleDateString(
                    language === 'ar' ? 'ar-SA' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  {language === 'ar' ? 'درجة الامتثال' : 'Compliance Score'}
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="text-3xl font-bold">{analysisResult.compliance_score}</div>
                  <div className="text-gray-500">/100</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  {language === 'ar' ? 'مستوى الامتثال' : 'Compliance Level'}
                </div>
                <Badge className={`${getComplianceBadgeColor(analysisResult.compliance_score)} text-white`}>
                  {translatedComplianceLevel}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تبويبات تفاصيل التحليل */}
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="issues">
            {language === 'ar' ? 'المشكلات' : 'Issues'}
            {analysisResult.issues.length > 0 && (
              <Badge className="ml-2 rtl:mr-2 rtl:ml-0 bg-red-500 text-white">
                {analysisResult.issues.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="missing">
            {language === 'ar' ? 'البنود المفقودة' : 'Missing Clauses'}
            {analysisResult.missing_clauses.length > 0 && (
              <Badge className="ml-2 rtl:mr-2 rtl:ml-0 bg-orange-400 text-white">
                {analysisResult.missing_clauses.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="compliant">
            {language === 'ar' ? 'البنود المتوافقة' : 'Compliant Clauses'}
            {analysisResult.compliant_clauses.length > 0 && (
              <Badge className="ml-2 rtl:mr-2 rtl:ml-0 bg-green-500 text-white">
                {analysisResult.compliant_clauses.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* تبويب المشكلات */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'المشكلات المكتشفة' : 'Identified Issues'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.issues.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  {language === 'ar'
                    ? 'لم يتم اكتشاف أي مشكلات في العقد'
                    : 'No issues were found in the contract'}
                </div>
              ) : (
                <div className="space-y-6">
                  {analysisResult.issues.map((issue, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getSeverityBadgeColor(issue.severity)} text-white`}>
                          {language === 'ar' ? 'الشدة: ' : 'Severity: '}
                          {translateSeverity(issue.severity)}
                        </Badge>
                      </div>
                      <div className="font-medium mb-2">{issue.description}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          {language === 'ar' ? 'التوصية: ' : 'Recommendation: '}
                        </span>
                        {issue.recommendation}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">
                          {language === 'ar' ? 'المرجع: ' : 'Reference: '}
                        </span>
                        {issue.reference}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب البنود المفقودة */}
        <TabsContent value="missing">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'البنود المفقودة' : 'Missing Clauses'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.missing_clauses.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  {language === 'ar'
                    ? 'لا توجد بنود مفقودة في العقد'
                    : 'No missing clauses in the contract'}
                </div>
              ) : (
                <div className="space-y-6">
                  {analysisResult.missing_clauses.map((clause, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={`${
                            clause.importance === 'high'
                              ? 'bg-red-500'
                              : clause.importance === 'medium'
                              ? 'bg-orange-400'
                              : 'bg-yellow-400'
                          } text-white`}
                        >
                          {language === 'ar' ? 'الأهمية: ' : 'Importance: '}
                          {translateImportance(clause.importance)}
                        </Badge>
                      </div>
                      <div className="font-medium mb-2">{clause.description}</div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">
                          {language === 'ar' ? 'التوصية: ' : 'Recommendation: '}
                        </span>
                        {clause.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب البنود المتوافقة */}
        <TabsContent value="compliant">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'البنود المتوافقة' : 'Compliant Clauses'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.compliant_clauses.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  {language === 'ar'
                    ? 'لم يتم العثور على بنود متوافقة في العقد'
                    : 'No compliant clauses found in the contract'}
                </div>
              ) : (
                <div className="space-y-6">
                  {analysisResult.compliant_clauses.map((clause, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <Badge className="bg-green-500 text-white">
                          {language === 'ar' ? 'متوافق' : 'Compliant'}
                        </Badge>
                      </div>
                      <div className="font-medium mb-2">{clause.description}</div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">
                          {language === 'ar' ? 'المرجع: ' : 'Reference: '}
                        </span>
                        {clause.reference}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
