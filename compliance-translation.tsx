"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";

// Mapping of compliance results from English to Arabic
const complianceTranslations = {
  // Compliance levels
  "Excellent Compliance": "امتثال ممتاز",
  "Good Compliance": "امتثال جيد",
  "Moderate Compliance": "امتثال متوسط",
  "Poor Compliance": "امتثال ضعيف",
  "Critical Non-Compliance": "عدم امتثال حرج",
  
  // Risk levels
  "High Risk": "مخاطر عالية",
  "Medium Risk": "مخاطر متوسطة",
  "Low Risk": "مخاطر منخفضة",
  
  // Common phrases
  "Missing Required Clause": "بند مطلوب مفقود",
  "Legal Violation": "مخالفة قانونية",
  "Recommendation": "توصية",
  "Compliant": "متوافق",
  "Non-Compliant": "غير متوافق",
  "Contract Analysis Results": "نتائج تحليل العقد",
  "Overall Compliance Score": "درجة الامتثال الإجمالية",
  "Legal Issues Found": "المشكلات القانونية المكتشفة",
  "Missing Clauses": "البنود المفقودة",
  "Recommendations": "التوصيات"
};

/**
 * Translates compliance results to Arabic if the current language is Arabic
 * @param {string} text - The English text to translate
 * @param {string} language - The current language (ar or en)
 * @returns {string} - Translated text if available, original text otherwise
 */
export function translateComplianceResult(text, language) {
  if (!text || language !== 'ar') return text;
  
  // Check for exact matches
  if (complianceTranslations[text]) {
    return complianceTranslations[text];
  }
  
  // Check for partial matches (for sentences containing key phrases)
  for (const [english, arabic] of Object.entries(complianceTranslations)) {
    if (text.includes(english)) {
      return text.replace(english, arabic);
    }
  }
  
  // Return original if no translation found
  return text;
}

/**
 * Component that displays text with automatic translation for compliance results
 */
export function ComplianceText({ text, className = "" }) {
  const { language } = useLanguage();
  const translatedText = translateComplianceResult(text, language);
  const isArabic = language === 'ar';
  
  return (
    <span className={`${isArabic ? 'font-cairo' : 'font-inter'} ${className}`}>
      {translatedText}
    </span>
  );
}

/**
 * Hook to use the translation functionality in other components
 */
export function useComplianceTranslation() {
  const { language } = useLanguage();
  
  const translate = (text) => {
    return translateComplianceResult(text, language);
  };
  
  return { translate };
}

export default {
  ComplianceText,
  useComplianceTranslation,
  translateComplianceResult
};
