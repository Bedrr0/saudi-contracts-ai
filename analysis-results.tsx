"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";
import { useContract } from "@/lib/contract-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ComplianceText } from "@/lib/compliance-translation";

// Define the analysis result type
type AnalysisResultType = {
  compliance_score: number;
  overall_risk: string;
  violations: Array<{
    description: string;
    reference: string;
    risk: string;
  }>;
  missing_clauses: Array<{
    name: string;
    description: string;
  }>;
  risks: Array<{
    description: string;
    explanation: string;
    severity: string;
  }>;
  recommendations: string[];
};

// Define mock data for development and testing
const mockAnalysisResult: AnalysisResultType = {
  compliance_score: 85,
  overall_risk: "Medium",
  violations: [
    {
      description: "Working hours exceed legal limit",
      reference: "Saudi Labor Law Article 98",
      risk: "High"
    }
  ],
  missing_clauses: [
    {
      name: "Probation Period",
      description: "Contract must specify probation period duration"
    }
  ],
  risks: [
    {
      description: "Non-compete clause duration",
      explanation: "Duration exceeds legal maximum of 2 years",
      severity: "Medium"
    }
  ],
  recommendations: [
    "Reduce working hours to comply with Saudi Labor Law",
    "Add probation period clause with specific duration"
  ]
};

export default function AnalysisResults() {
  const { language } = useLanguage();
  const { analysisResult, resetAnalysis } = useContract();
  const isArabic = language === 'ar';
  
  // Use mock data if no real analysis result is available
  // Use type assertion to ensure TypeScript understands the structure
  const result = (analysisResult as AnalysisResultType) || mockAnalysisResult;

  const getComplianceColor = (score: number): string => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRiskBadgeVariant = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case 'high':
        return "bg-red-100 text-red-800 border-red-200";
      case 'medium':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low':
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className={`mt-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
          {isArabic ? 'نتائج تحليل العقد' : 'Contract Analysis Results'}
        </h2>
        <button 
          onClick={resetAnalysis}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
        >
          {isArabic ? 'تحليل عقد آخر' : 'Analyze Another Contract'}
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className={`text-xl ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'درجة الامتثال' : 'Compliance Score'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-3xl font-bold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {result.compliance_score}%
              </span>
              <Badge className={getRiskBadgeVariant(result.overall_risk)}>
                <ComplianceText text={result.overall_risk} />
              </Badge>
            </div>
            <Progress 
              value={result.compliance_score} 
              className={`h-3 ${getComplianceColor(result.compliance_score)}`} 
            />
            <p className={`text-sm text-gray-500 mt-2 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic 
                ? 'درجة امتثال العقد للأنظمة واللوائح السعودية'
                : 'Contract compliance score with Saudi regulations'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-xl ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'المخالفات القانونية' : 'Legal Violations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.violations.length > 0 ? (
              <ul className="space-y-3">
                {result.violations.map((violation, index) => (
                  <li key={index} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className={`${isArabic ? 'font-cairo' : 'font-inter'}`}>
                        <p className="font-medium">
                          <ComplianceText text={violation.description} />
                        </p>
                        <p className="text-sm text-gray-500">
                          <ComplianceText text={`Reference: ${violation.reference}`} />
                        </p>
                      </div>
                      <Badge className={getRiskBadgeVariant(violation.risk)}>
                        <ComplianceText text={violation.risk} />
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-green-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'لا توجد مخالفات قانونية' : 'No legal violations found'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-xl ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'البنود المفقودة' : 'Missing Clauses'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.missing_clauses.length > 0 ? (
              <ul className="space-y-3">
                {result.missing_clauses.map((clause, index) => (
                  <li key={index} className="border-b pb-2 last:border-0">
                    <p className={`font-medium ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                      <ComplianceText text={clause.name} />
                    </p>
                    <p className={`text-sm text-gray-500 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                      <ComplianceText text={clause.description} />
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-green-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'جميع البنود المطلوبة موجودة' : 'All required clauses are present'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className={`text-xl ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'المخاطر المحتملة' : 'Potential Risks'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.risks.length > 0 ? (
            <ul className="space-y-3">
              {result.risks.map((risk, index) => (
                <li key={index} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className={`${isArabic ? 'font-cairo' : 'font-inter'}`}>
                      <p className="font-medium">
                        <ComplianceText text={risk.description} />
                      </p>
                      <p className="text-sm text-gray-500">
                        <ComplianceText text={risk.explanation} />
                      </p>
                    </div>
                    <Badge className={getRiskBadgeVariant(risk.severity)}>
                      <ComplianceText text={risk.severity} />
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-green-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'لا توجد مخاطر محتملة' : 'No potential risks identified'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`text-xl ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'التوصيات' : 'Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className={`${isArabic ? 'font-cairo' : 'font-inter'}`}>
                  <p className="font-medium">
                    <ComplianceText text={recommendation} />
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-green-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'لا توجد توصيات إضافية' : 'No additional recommendations'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
