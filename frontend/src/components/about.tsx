"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";

export default function About() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isArabic ? 'rtl' : 'ltr'}`}>
          <h2 className={`text-3xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'عن نظام العقود الذكية السعودية' : 'About Saudi AI Contracts'}
          </h2>
          <p className={`text-gray-600 max-w-2xl mx-auto ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic 
              ? 'منصة متخصصة تعتمد على الذكاء الاصطناعي لتحليل العقود القانونية ومطابقتها مع الأنظمة واللوائح السعودية'
              : 'A specialized platform that uses artificial intelligence to analyze legal contracts and match them with Saudi regulations'}
          </p>
        </div>
      </div>
    </section>
  );
}
