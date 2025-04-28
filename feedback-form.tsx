"use client";

import React, { useState } from 'react';
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, Phone } from "lucide-react";

export function FeedbackForm() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the feedback to a server
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-16 bg-gray-50" id="feedback">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isArabic ? 'rtl' : 'ltr'}`}>
          <h2 className={`text-3xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'هل لديك ملاحظة أو مشكلة؟' : 'Have Feedback or Issues?'}
          </h2>
          <p className={`text-gray-600 max-w-2xl mx-auto ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic 
              ? 'نحن نهتم بتجربتك! إذا واجهتك أي مشكلة أو لديك ملاحظة بخصوص الخدمة أو نتائج التحليل، يمكنك مراسلتنا مباشرة.'
              : 'We care about your experience! If you encounter any issues or have feedback about the service or analysis results, you can contact us directly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className={`${isArabic ? 'order-2 lg:order-1' : 'order-1'}`}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className={`text-xl font-bold ${isArabic ? 'font-cairo text-right' : 'font-inter'}`}>
                  {isArabic ? 'أرسل ملاحظتك' : 'Send Your Feedback'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className={`space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                      {isArabic ? 'الاسم' : 'Name'}
                    </label>
                    <Input 
                      type="text" 
                      placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'} 
                      className={isArabic ? 'text-right font-cairo' : 'font-inter'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                      {isArabic ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <Input 
                      type="email" 
                      placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} 
                      className={isArabic ? 'text-right font-cairo' : 'font-inter'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                      {isArabic ? 'نوع الملاحظة' : 'Feedback Type'}
                    </label>
                    <select 
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${isArabic ? 'text-right font-cairo' : 'font-inter'}`}
                      required
                    >
                      <option value="" disabled selected>{isArabic ? 'اختر نوع الملاحظة' : 'Select feedback type'}</option>
                      <option value="issue">{isArabic ? 'مشكلة تقنية' : 'Technical Issue'}</option>
                      <option value="suggestion">{isArabic ? 'اقتراح تحسين' : 'Improvement Suggestion'}</option>
                      <option value="analysis">{isArabic ? 'مشكلة في نتائج التحليل' : 'Analysis Results Issue'}</option>
                      <option value="other">{isArabic ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                      {isArabic ? 'الرسالة' : 'Message'}
                    </label>
                    <Textarea 
                      placeholder={isArabic ? 'اكتب ملاحظتك هنا...' : 'Write your feedback here...'} 
                      className={`min-h-[150px] ${isArabic ? 'text-right font-cairo' : 'font-inter'}`}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={submitted}
                  >
                    {submitted ? (
                      isArabic ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'
                    ) : (
                      <>
                        {isArabic ? 'إرسال الملاحظة' : 'Send Feedback'}
                        <Send className={`h-4 w-4 ${isArabic ? 'mr-2' : 'ml-2'}`} />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className={`${isArabic ? 'order-1 lg:order-2 text-right' : 'order-2 text-left'}`}>
            <h3 className={`text-2xl font-bold mb-6 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'تواصل معنا مباشرة' : 'Contact Us Directly'}
            </h3>
            
            <div className="space-y-6">
              <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`${isArabic ? 'ml-4' : 'mr-4'} bg-blue-100 p-3 rounded-full`}>
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                    {isArabic ? 'البريد الرسمي للدعم' : 'Official Support Email'}
                  </h4>
                  <p className="text-gray-600">support@saudi-ai-contracts.com</p>
                </div>
              </div>
              
              <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`${isArabic ? 'ml-4' : 'mr-4'} bg-green-100 p-3 rounded-full`}>
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                    {isArabic ? 'الدعم الفني' : 'Technical Support'}
                  </h4>
                  <p className="text-gray-600">+966 55 000 0000</p>
                </div>
              </div>
            </div>
            
            <div className={`mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 ${isArabic ? 'text-right' : 'text-left'}`}>
              <h4 className={`text-lg font-semibold mb-2 text-blue-800 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'ملاحظة هامة' : 'Important Note'}
              </h4>
              <p className={`text-blue-700 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic 
                  ? 'سنقوم بمراجعة كل ملاحظة بعناية لضمان تطوير الخدمة باستمرار. نحن نقدر وقتك ومساهمتك في تحسين منصتنا.'
                  : 'We will carefully review each feedback to ensure continuous service improvement. We appreciate your time and contribution to improving our platform.'}
              </p>
            </div>
            
            <div className="mt-8">
              <h4 className={`text-xl font-semibold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'ساعات الدعم الفني' : 'Support Hours'}
              </h4>
              <div className={`grid grid-cols-2 gap-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-medium">{isArabic ? 'أيام الأسبوع' : 'Weekdays'}</p>
                  <p className="text-gray-600">{isArabic ? '9 صباحاً - 9 مساءً' : '9 AM - 9 PM'}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-medium">{isArabic ? 'عطلة نهاية الأسبوع' : 'Weekends'}</p>
                  <p className="text-gray-600">{isArabic ? '10 صباحاً - 6 مساءً' : '10 AM - 6 PM'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeedbackForm;
