"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

export default function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  
  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);
  
  return (
    <div className={`responsive-container ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}>
      {children}
    </div>
  );
}
