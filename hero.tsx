"use client";

import { useLanguage } from '@/lib/language-context';

export default function Hero() {
  const { t, language } = useLanguage();
  
  return (
    <section className="bg-gradient-to-r from-primary/90 to-primary text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={`text-3xl md:text-5xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}>
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            {t('hero.subtitle')}
          </p>
          <a 
            href="#upload"
            className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-white/90 transition-colors"
          >
            {t('hero.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}
