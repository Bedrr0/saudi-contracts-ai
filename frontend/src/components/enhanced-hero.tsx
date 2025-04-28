"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Star } from "lucide-react";

export function EnhancedHero() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-repeat"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-500 rounded-full opacity-20 animate-float-delay"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-500 rounded-full opacity-10 animate-float-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`flex flex-col lg:flex-row items-center ${isArabic ? 'lg:flex-row-reverse text-right' : 'text-left'} gap-12`}>
          <div className="lg:w-1/2">
            <div className={`mb-6 inline-flex items-center px-4 py-2 rounded-full bg-blue-800/50 text-blue-200 text-sm ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              <Star className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
              {isArabic ? 'الحل الأمثل لتحليل العقود في المملكة' : 'The Ultimate Contract Analysis Solution in KSA'}
            </div>
            
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic 
                ? 'حلل عقودك القانونية مع Saudi AI Contracts'
                : 'Analyze Your Legal Contracts with Saudi AI Contracts'}
            </h1>
            
            <p className={`text-xl text-blue-100 mb-8 max-w-xl ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic 
                ? 'ضمان الامتثال للقوانين واللوائح السعودية باستخدام تقنيات الذكاء الاصطناعي المتقدمة'
                : 'Ensure compliance with Saudi laws and regulations using advanced AI technology'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                {isArabic ? 'ابدأ التحليل' : 'Start Analysis'}
                {isArabic ? <ArrowLeft className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
              
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 rounded-lg text-lg">
                {isArabic ? 'تعرف على الباقات' : 'View Plans'}
              </Button>
            </div>
            
            <div className={`mt-8 flex items-center ${isArabic ? 'justify-end' : 'justify-start'}`}>
              <div className="flex -space-x-2">
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/86.jpg" alt="User" />
              </div>
              <p className={`ml-4 text-sm text-blue-100 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? '+500 مستخدم نشط' : '+500 active users'}
              </p>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Main Image */}
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-1 rounded-2xl shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  <img 
                    src="/contract-analysis-demo.png" 
                    alt="Contract Analysis Demo" 
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/EEE/31343C?text=Contract+Analysis+Demo";
                    }}
                  />
                </div>
              </div>
              
              {/* Floating Badge 1 */}
              <div className="absolute -top-6 -right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3">
                <div className={`text-sm font-semibold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                  {isArabic ? 'دقة تحليل 98%' : '98% Analysis Accuracy'}
                </div>
              </div>
              
              {/* Floating Badge 2 */}
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-2">
                <div className={`text-sm font-semibold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                  {isArabic ? 'متوافق مع الأنظمة السعودية' : 'Saudi Regulations Compliant'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center ${isArabic ? 'rtl' : 'ltr'}`}>
          <TrustItem 
            number="6+" 
            textAr="أنظمة سعودية مدعومة" 
            textEn="Saudi Regulations Supported"
            isArabic={isArabic}
          />
          <TrustItem 
            number="10K+" 
            textAr="عقد تم تحليله" 
            textEn="Contracts Analyzed"
            isArabic={isArabic}
          />
          <TrustItem 
            number="98%" 
            textAr="دقة التحليل" 
            textEn="Analysis Accuracy"
            isArabic={isArabic}
          />
          <TrustItem 
            number="24/7" 
            textAr="دعم فني متاح" 
            textEn="Technical Support"
            isArabic={isArabic}
          />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ number, textAr, textEn, isArabic }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <div className="text-3xl font-bold text-white mb-1">{number}</div>
      <div className={`text-sm text-blue-100 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
        {isArabic ? textAr : textEn}
      </div>
    </div>
  );
}

export default EnhancedHero;
