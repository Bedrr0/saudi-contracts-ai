"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCardProps {
  icon: React.ReactNode;
  titleAr: string;
  titleEn: string;
  isArabic: boolean;
}

export function AboutUs() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section className="py-16 bg-white" id="about-us">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className={`${isArabic ? 'order-2 md:order-1 text-right' : 'order-1 text-left'}`}>
            <h3 className={`text-2xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'ما هو نظام العقود الذكية السعودية؟' : 'What is Saudi AI Contracts?'}
            </h3>
            <p className={`text-gray-600 mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic 
                ? 'نظام العقود الذكية السعودية هو منصة متخصصة تعتمد على تقنيات الذكاء الاصطناعي لتحليل العقود القانونية ومطابقتها مع الأنظمة واللوائح السعودية. يساعد النظام المحامين والشركات والأفراد على التأكد من امتثال عقودهم للقوانين السعودية وتحديد المخاطر القانونية المحتملة.'
                : 'Saudi AI Contracts is a specialized platform that uses artificial intelligence technologies to analyze legal contracts and match them with Saudi regulations. The system helps lawyers, companies, and individuals ensure their contracts comply with Saudi laws and identify potential legal risks.'}
            </p>
            <p className={`text-gray-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic 
                ? 'يدعم النظام أربعة أنواع رئيسية من العقود: عقود العمل، عقود الإيجار، عقود البيع، وعقود الشراكة. يقوم النظام بتحليل هذه العقود وفقًا للأنظمة واللوائح السعودية ذات الصلة، ويقدم تقارير مفصلة عن مدى الامتثال والمخاطر المحتملة والتوصيات لتحسين العقود.'
                : 'The system supports four main types of contracts: employment contracts, rental contracts, sales contracts, and partnership contracts. The system analyzes these contracts according to relevant Saudi regulations and provides detailed reports on compliance, potential risks, and recommendations for improving contracts.'}
            </p>
          </div>
          <div className={`${isArabic ? 'order-1 md:order-2' : 'order-2'} flex items-center justify-center`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl transform rotate-3"></div>
              <Card className="relative shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                  <CardTitle className={`text-xl ${isArabic ? 'font-cairo text-right' : 'font-inter'}`}>
                    {isArabic ? 'تحليل العقود الذكي' : 'Smart Contract Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className={`space-y-3 ${isArabic ? 'text-right font-cairo' : 'font-inter'}`}>
                    <li className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-green-500 ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                      <span>{isArabic ? 'تحليل متوافق مع القوانين السعودية' : 'Analysis compliant with Saudi laws'}</span>
                    </li>
                    <li className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-blue-500 ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                      <span>{isArabic ? 'دعم لأربعة أنواع من العقود' : 'Support for four types of contracts'}</span>
                    </li>
                    <li className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-purple-500 ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                      <span>{isArabic ? 'تقارير مفصلة عن المخاطر القانونية' : 'Detailed reports on legal risks'}</span>
                    </li>
                    <li className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-yellow-500 ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                      <span>{isArabic ? 'توصيات لتحسين العقود' : 'Recommendations for improving contracts'}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className={`text-2xl font-bold mb-8 text-center ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'الأنظمة واللوائح السعودية المدعومة' : 'Supported Saudi Regulations'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard 
              icon={<span className="text-blue-500">⚖️</span>}
              titleAr="نظام العمل السعودي"
              titleEn="Saudi Labor Law"
              isArabic={isArabic}
            />
            <ServiceCard 
              icon={<span className="text-green-500">🏢</span>}
              titleAr="نظام إيجار"
              titleEn="Ejar Rental Regulations"
              isArabic={isArabic}
            />
            <ServiceCard 
              icon={<span className="text-purple-500">💼</span>}
              titleAr="نظام الشركات"
              titleEn="Companies Law"
              isArabic={isArabic}
            />
            <ServiceCard 
              icon={<span className="text-yellow-500">🧾</span>}
              titleAr="أنظمة ضريبة القيمة المضافة"
              titleEn="VAT Regulations"
              isArabic={isArabic}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl">
          <h3 className={`text-2xl font-bold mb-6 text-center ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'كيف يعمل النظام؟' : 'How Does the System Work?'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`bg-white p-6 rounded-xl shadow-sm ${isArabic ? 'rtl text-right' : 'ltr'}`}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h4 className={`text-xl font-bold mb-2 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'رفع العقد' : 'Upload Contract'}
              </h4>
              <p className={`text-gray-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic 
                  ? 'قم برفع العقد بتنسيق PDF أو DOCX أو TXT وتحديد نوع العقد (عمل، إيجار، بيع، شراكة)'
                  : 'Upload your contract in PDF, DOCX, or TXT format and specify the contract type (employment, rental, sales, partnership)'}
              </p>
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-sm ${isArabic ? 'rtl text-right' : 'ltr'}`}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h4 className={`text-xl font-bold mb-2 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'تحليل ذكي' : 'Smart Analysis'}
              </h4>
              <p className={`text-gray-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic 
                  ? 'يقوم النظام بتحليل العقد ومقارنته مع الأنظمة واللوائح السعودية ذات الصلة باستخدام الذكاء الاصطناعي'
                  : 'The system analyzes the contract and compares it with relevant Saudi regulations using artificial intelligence'}
              </p>
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-sm ${isArabic ? 'rtl text-right' : 'ltr'}`}>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className={`text-xl font-bold mb-2 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'تقرير مفصل' : 'Detailed Report'}
              </h4>
              <p className={`text-gray-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic 
                  ? 'احصل على تقرير مفصل يوضح درجة الامتثال والمخاطر القانونية والبنود المفقودة والتوصيات لتحسين العقد'
                  : 'Get a detailed report showing compliance score, legal risks, missing clauses, and recommendations for improving the contract'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, titleAr, titleEn, isArabic }: ServiceCardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 ${isArabic ? 'rtl text-right' : 'ltr text-left'}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className={`text-lg font-bold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
        {isArabic ? titleAr : titleEn}
      </h3>
    </div>
  );
}

export default AboutUs;
