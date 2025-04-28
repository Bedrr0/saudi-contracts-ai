"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const subscriptionPlans = [
  {
    id: 'free',
    nameEn: 'Free Trial',
    nameAr: 'الباقة المجانية',
    priceEn: '0 SAR',
    priceAr: '0 ر.س',
    featuresEn: ['Analysis of one contract only', 'Limited trial'],
    featuresAr: ['تحليل عقد واحد فقط', 'تجربة محدودة'],
    colorClass: 'bg-gray-100 border-gray-200',
    buttonColorClass: 'bg-gray-500 hover:bg-gray-600',
    popular: false
  },
  {
    id: 'basic',
    nameEn: 'Basic Plan for Individuals',
    nameAr: 'الباقة الأساسية للأفراد',
    priceEn: '149 SAR',
    priceAr: '149 ر.س',
    featuresEn: [
      'Analysis of 10 contracts per month',
      'Contract storage for 3 months',
      'Analysis reports in Arabic and English'
    ],
    featuresAr: [
      'تحليل 10 عقود شهريًا',
      'تخزين العقود 3 أشهر',
      'تقارير تحليل بالعربية والإنجليزية'
    ],
    colorClass: 'bg-blue-50 border-blue-200',
    buttonColorClass: 'bg-blue-600 hover:bg-blue-700',
    popular: false
  },
  {
    id: 'business',
    nameEn: 'Small Business Plan',
    nameAr: 'باقة الشركات الصغيرة',
    priceEn: '799 SAR',
    priceAr: '799 ر.س',
    featuresEn: [
      'Analysis of 50 contracts per month',
      'Professional PDF report extraction',
      'Email and WhatsApp support'
    ],
    featuresAr: [
      'تحليل 50 عقدًا شهريًا',
      'استخراج تقارير PDF احترافية',
      'دعم عبر البريد الإلكتروني والواتساب'
    ],
    colorClass: 'bg-green-50 border-green-200',
    buttonColorClass: 'bg-green-600 hover:bg-green-700',
    popular: true
  },
  {
    id: 'enterprise',
    nameEn: 'Enterprise Plan',
    nameAr: 'الباقة الاحترافية للشركات الكبرى',
    priceEn: '1,999 SAR',
    priceAr: '1,999 ر.س',
    featuresEn: [
      'Unlimited analysis',
      'Unlimited storage',
      '24/7 immediate technical support',
      'Exclusive access to contract comparison reports'
    ],
    featuresAr: [
      'تحليلات غير محدودة',
      'تخزين غير محدود',
      'دعم فني فوري 24/7',
      'وصول حصري لتقارير مقارنة العقود'
    ],
    colorClass: 'bg-purple-50 border-purple-200',
    buttonColorClass: 'bg-purple-600 hover:bg-purple-700',
    popular: false
  }
];

export function SubscriptionPlans() {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section className="py-12 bg-gray-50" id="subscription-plans">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'اختر خطتك' : 'Choose Your Plan'}
          </h2>
          <p className={`text-gray-600 max-w-2xl mx-auto ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic 
              ? 'اختر الباقة المناسبة لك لتحصل على أفضل حماية لعقودك'
              : 'Select the appropriate plan to get the best protection for your contracts'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`${plan.colorClass} border-2 relative transition-all hover:shadow-lg ${plan.popular ? 'transform -translate-y-2' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                  {isArabic ? 'الأكثر شيوعاً' : 'Most Popular'}
                </div>
              )}
              <CardHeader>
                <CardTitle className={`text-xl font-bold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                  {isArabic ? plan.nameAr : plan.nameEn}
                </CardTitle>
                <CardDescription className={`text-2xl font-bold mt-2 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                  {isArabic ? plan.priceAr : plan.priceEn}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {isArabic ? '/ شهرياً' : '/ month'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className={`space-y-3 ${isArabic ? 'text-right' : 'text-left'}`}>
                  {(isArabic ? plan.featuresAr : plan.featuresEn).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className={`h-5 w-5 text-green-500 ${isArabic ? 'ml-2 order-last' : 'mr-2'}`} />
                      <span className={`${isArabic ? 'font-cairo' : 'font-inter'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.buttonColorClass} text-white`}>
                  {isArabic ? 'اشترك الآن' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className={`text-sm text-gray-500 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic 
              ? '✅ جميع خططنا تضمن لك تحليل ذكي دقيق وفق الأنظمة والقوانين السعودية الرسمية.'
              : '✅ All our plans guarantee accurate AI analysis according to official Saudi laws and regulations.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default SubscriptionPlans;
