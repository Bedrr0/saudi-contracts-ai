"use client";

import React from 'react';
import { useLanguage } from "@/lib/language-context";
import { EnhancedHero } from "@/components/enhanced-hero";
import { SubscriptionPlans } from "@/components/subscription-plans";
import { AboutUs } from "@/components/about-us";
import { FeedbackForm } from "@/components/feedback-form";
import { FutureUpdateCapabilities } from "@/components/future-update-capabilities";
import { ComplianceText } from "@/lib/compliance-translation";

interface NavLinkProps {
  href: string;
  text: string;
  isArabic: boolean;
}

interface FooterLinkProps {
  href: string;
  text: string;
  isArabic: boolean;
}

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <main className={`min-h-screen ${isArabic ? 'rtl' : 'ltr'}`}>
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Saudi AI Contracts Logo" className="h-10 w-auto" />
            <h1 className={`text-xl font-bold ml-2 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic ? 'العقود الذكية السعودية' : 'Saudi AI Contracts'}
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <NavLink href="#subscription-plans" text={isArabic ? 'الباقات' : 'Plans'} isArabic={isArabic} />
            <NavLink href="#about-us" text={isArabic ? 'من نحن' : 'About Us'} isArabic={isArabic} />
            <NavLink href="#feedback" text={isArabic ? 'تواصل معنا' : 'Contact'} isArabic={isArabic} />
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isArabic ? 'English' : 'العربية'}
            </button>
            
            <button className="hidden md:block px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
              {isArabic ? 'تسجيل الدخول' : 'Login'}
            </button>
          </div>
        </div>
      </header>

      <EnhancedHero />
      
      <SubscriptionPlans />
      
      <AboutUs />
      
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${isArabic ? 'rtl' : 'ltr'}`}>
            <h2 className={`text-3xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              <ComplianceText text="Contract Analysis Results" />
            </h2>
            <p className={`text-gray-600 max-w-2xl mx-auto ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              {isArabic 
                ? 'نتائج تحليل العقود مترجمة تلقائيًا إلى العربية'
                : 'Contract analysis results automatically translated to Arabic'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`bg-white p-6 rounded-xl shadow-md ${isArabic ? 'rtl text-right' : 'ltr'}`}>
              <h3 className={`text-xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'بالإنجليزية:' : 'In English:'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Excellent Compliance</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Medium Risk</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Missing Required Clause</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Overall Compliance Score: 85%</span>
                </li>
              </ul>
            </div>
            
            <div className={`bg-white p-6 rounded-xl shadow-md ${isArabic ? 'rtl text-right' : 'ltr'}`}>
              <h3 className={`text-xl font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'بالعربية:' : 'In Arabic:'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <ComplianceText text="Excellent Compliance" />
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <ComplianceText text="Medium Risk" />
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <ComplianceText text="Missing Required Clause" />
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <ComplianceText text="Overall Compliance Score: 85%" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <FeedbackForm />
      
      <FutureUpdateCapabilities />
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h3 className={`text-lg font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'العقود الذكية السعودية' : 'Saudi AI Contracts'}
              </h3>
              <p className={`text-gray-400 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic 
                  ? 'منصة سعودية متخصصة تعتمد على الذكاء الاصطناعي لتحليل العقود القانونية'
                  : 'A specialized Saudi platform that uses AI to analyze legal contracts'}
              </p>
            </div>
            
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h3 className={`text-lg font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <ul className="space-y-2">
                <FooterLink href="#" text={isArabic ? 'الرئيسية' : 'Home'} isArabic={isArabic} />
                <FooterLink href="#subscription-plans" text={isArabic ? 'الباقات' : 'Plans'} isArabic={isArabic} />
                <FooterLink href="#about-us" text={isArabic ? 'من نحن' : 'About Us'} isArabic={isArabic} />
                <FooterLink href="#feedback" text={isArabic ? 'تواصل معنا' : 'Contact'} isArabic={isArabic} />
              </ul>
            </div>
            
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h3 className={`text-lg font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'تواصل معنا' : 'Contact Us'}
              </h3>
              <ul className="space-y-2">
                <li className={`flex items-center ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                  <span className={`${isArabic ? 'mr-2' : 'ml-2'}`}>support@saudi-ai-contracts.com</span>
                </li>
                <li className={`flex items-center ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                  <span className={`${isArabic ? 'mr-2' : 'ml-2'}`}>+966 55 000 0000</span>
                </li>
              </ul>
            </div>
            
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h3 className={`text-lg font-bold mb-4 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
                {isArabic ? 'قانوني' : 'Legal'}
              </h3>
              <ul className="space-y-2">
                <FooterLink href="#" text={isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'} isArabic={isArabic} />
                <FooterLink href="#" text={isArabic ? 'شروط الخدمة' : 'Terms of Service'} isArabic={isArabic} />
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className={`text-gray-400 ${isArabic ? 'font-cairo' : 'font-inter'}`}>
              © {new Date().getFullYear()} Saudi AI Contracts. {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function NavLink({ href, text, isArabic }: NavLinkProps) {
  return (
    <a 
      href={href} 
      className={`text-gray-700 hover:text-primary transition-colors ${isArabic ? 'font-cairo' : 'font-inter'}`}
    >
      {text}
    </a>
  );
}

function FooterLink({ href, text, isArabic }: FooterLinkProps) {
  return (
    <li>
      <a 
        href={href} 
        className={`text-gray-400 hover:text-white transition-colors ${isArabic ? 'font-cairo' : 'font-inter'}`}
      >
        {text}
      </a>
    </li>
  );
}
