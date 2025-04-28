"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Mail, Phone, Settings } from "lucide-react";

export function FutureUpdateCapabilities() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section className="py-16 bg-white" id="admin-features">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isArabic ? 'rtl' : 'ltr'}`}>
          <h2 className={`text-3xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic ? 'إمكانيات التحديث المستقبلية' : 'Future Update Capabilities'}
          </h2>
          <p className={`text-gray-600 max-w-2xl mx-auto ${isArabic ? 'font-cairo' : 'font-inter'}`}>
            {isArabic 
              ? 'تم تصميم النظام ليكون قابلاً للتحديث والتطوير بسهولة لتلبية احتياجاتك المستقبلية'
              : 'The system is designed to be easily updatable and expandable to meet your future needs'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UpdateFeatureCard 
            icon={<FileText className="h-10 w-10 text-blue-500" />}
            titleEn="Add New Legal Documents"
            titleAr="إضافة وثائق قانونية جديدة"
            descriptionEn="Easily add new Saudi legal documents or laws to keep the system up-to-date with the latest regulations."
            descriptionAr="إضافة وثائق قانونية سعودية جديدة أو قوانين بسهولة للحفاظ على تحديث النظام بأحدث اللوائح."
            isArabic={isArabic}
          />
          
          <UpdateFeatureCard 
            icon={<Mail className="h-10 w-10 text-green-500" />}
            titleEn="Edit Contact Information"
            titleAr="تعديل معلومات الاتصال"
            descriptionEn="Easily update email addresses or phone numbers displayed in the footer and contact sections."
            descriptionAr="تحديث عناوين البريد الإلكتروني أو أرقام الهواتف المعروضة في التذييل وأقسام الاتصال بسهولة."
            isArabic={isArabic}
          />
          
          <UpdateFeatureCard 
            icon={<Settings className="h-10 w-10 text-purple-500" />}
            titleEn="Modify Subscription Plans"
            titleAr="تعديل خطط الاشتراك"
            descriptionEn="Add, remove, or modify subscription plans and integrate payment gateways like PayTabs or Stripe."
            descriptionAr="إضافة أو إزالة أو تعديل خطط الاشتراك ودمج بوابات الدفع مثل PayTabs أو Stripe."
            isArabic={isArabic}
          />
        </div>

        <div className="mt-16">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardTitle className={`text-xl font-bold ${isArabic ? 'font-cairo text-right' : 'font-inter'}`}>
                {isArabic ? 'لوحة تحكم المسؤول' : 'Admin Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x">
                <AdminFeature
                  title={isArabic ? 'تحديث الوثائق القانونية' : 'Update Legal Documents'}
                  isArabic={isArabic}
                >
                  <div className={`space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center">
                      <Upload className={`h-5 w-5 text-blue-500 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                      <span className={isArabic ? 'font-cairo' : 'font-inter'}>
                        {isArabic ? 'رفع ملف PDF للقانون الجديد' : 'Upload PDF file for new law'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className={`h-5 w-5 text-blue-500 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                      <span className={isArabic ? 'font-cairo' : 'font-inter'}>
                        {isArabic ? 'تحديد نوع القانون وتصنيفه' : 'Specify law type and category'}
                      </span>
                    </div>
                    <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                      {isArabic ? 'إضافة قانون جديد' : 'Add New Law'}
                    </Button>
                  </div>
                </AdminFeature>
                
                <AdminFeature
                  title={isArabic ? 'تحديث معلومات الاتصال' : 'Update Contact Information'}
                  isArabic={isArabic}
                >
                  <div className={`space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <div>
                      <label className={`block text-sm font-medium text-gray-700 mb-1 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                        {isArabic ? 'البريد الإلكتروني للدعم' : 'Support Email'}
                      </label>
                      <Input 
                        type="email" 
                        defaultValue="support@saudi-ai-contracts.com"
                        className={isArabic ? 'text-right font-cairo' : 'font-inter'}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-gray-700 mb-1 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                        {isArabic ? 'رقم هاتف الدعم الفني' : 'Support Phone Number'}
                      </label>
                      <Input 
                        type="tel" 
                        defaultValue="+966 55 000 0000"
                        className={isArabic ? 'text-right font-cairo' : 'font-inter'}
                      />
                    </div>
                    <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                      {isArabic ? 'حفظ التغييرات' : 'Save Changes'}
                    </Button>
                  </div>
                </AdminFeature>
                
                <AdminFeature
                  title={isArabic ? 'إدارة خطط الاشتراك' : 'Manage Subscription Plans'}
                  isArabic={isArabic}
                >
                  <div className={`space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className={isArabic ? 'font-cairo' : 'font-inter'}>
                        {isArabic ? 'الباقة الأساسية' : 'Basic Plan'}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          {isArabic ? 'تعديل' : 'Edit'}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className={isArabic ? 'font-cairo' : 'font-inter'}>
                        {isArabic ? 'باقة الشركات' : 'Business Plan'}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          {isArabic ? 'تعديل' : 'Edit'}
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white">
                      {isArabic ? 'إضافة خطة جديدة' : 'Add New Plan'}
                    </Button>
                  </div>
                </AdminFeature>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-xl">
          <div className={`text-center mb-8 ${isArabic ? 'rtl' : 'ltr'}`}>
            <h3 className={`text-2xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'إمكانية التكامل مع التطبيقات الأخرى' : 'API Integration Possibilities'}
            </h3>
            <p className={`text-gray-600 max-w-2xl mx-auto ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic 
                ? 'يمكن دمج النظام مع تطبيقات قانونية أخرى مثل تطبيق محامي أو أي تطبيقات قانونية سعودية أخرى'
                : 'The system can be integrated with other legal applications such as Mohamy App or other Saudi legal apps'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`bg-white p-6 rounded-xl shadow-sm ${isArabic ? 'rtl text-right' : 'ltr'}`}>
              <h4 className={`text-xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'واجهة برمجة التطبيقات (API)' : 'API Endpoints'}
              </h4>
              <ul className={`space-y-2 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                <li className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-green-500 ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /api/analyze-contract</code>
                </li>
                <li className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-green-500 ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /api/compliance-report/{'{id}'}</code>
                </li>
                <li className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-green-500 ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /api/legal-references</code>
                </li>
              </ul>
            </div>
            
            <div className={`bg-white p-6 rounded-xl shadow-sm ${isArabic ? 'rtl text-right' : 'ltr'}`}>
              <h4 className={`text-xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'تطبيقات متوافقة' : 'Compatible Applications'}
              </h4>
              <ul className={`space-y-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                <li className="flex items-center">
                  <div className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ${isArabic ? 'ml-3' : 'mr-3'}`}>
                    <span className="text-blue-600 font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">Mohamy App</p>
                    <p className="text-sm text-gray-600">
                      {isArabic ? 'تطبيق استشارات قانونية' : 'Legal consultation app'}
                    </p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className={`w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center ${isArabic ? 'ml-3' : 'mr-3'}`}>
                    <span className="text-purple-600 font-bold">N</span>
                  </div>
                  <div>
                    <p className="font-semibold">Najiz</p>
                    <p className="text-sm text-gray-600">
                      {isArabic ? 'منصة وزارة العدل' : 'Ministry of Justice platform'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UpdateFeatureCard({ icon, titleEn, titleAr, descriptionEn, descriptionAr, isArabic }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 ${isArabic ? 'rtl text-right' : 'ltr'}`}>
      <div className="mb-4">{icon}</div>
      <h3 className={`text-xl font-bold mb-3 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
        {isArabic ? titleAr : titleEn}
      </h3>
      <p className={`text-gray-600 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
        {isArabic ? descriptionAr : descriptionEn}
      </p>
    </div>
  );
}

function AdminFeature({ title, isArabic, children }) {
  return (
    <div className="p-6">
      <h3 className={`text-lg font-semibold mb-4 ${isArabic ? 'font-cairo text-right' : 'font-inter'}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default FutureUpdateCapabilities;
