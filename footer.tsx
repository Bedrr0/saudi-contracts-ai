"use client";

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';

export default function Footer() {
  const { t, language } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}>
              {t('app.title')}
            </h3>
            <p className="text-gray-400 mb-4">
              {t('app.subtitle')}
            </p>
          </div>
          
          <div>
            <h3 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}>
              {t('nav.about')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                  {t('about.title')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}>
              {t('nav.contact')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  info@saudiai.contracts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  +966 12 345 6789
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
