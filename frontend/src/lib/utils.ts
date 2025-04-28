import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getResponsiveFontSize(baseSize: number, minSize: number, maxSize: number) {
  return `clamp(${minSize}rem, ${baseSize}vw, ${maxSize}rem)`;
}

export function getDirectionClass(language: 'ar' | 'en') {
  return language === 'ar' ? 'rtl' : 'ltr';
}

export function getFontClass(language: 'ar' | 'en') {
  return language === 'ar' ? 'font-cairo' : 'font-inter';
}

export function getTextAlignClass(language: 'ar' | 'en') {
  return language === 'ar' ? 'text-right' : 'text-left';
}

export function getFlexDirectionClass(language: 'ar' | 'en', isRow: boolean = true) {
  if (!isRow) return '';
  return language === 'ar' ? 'flex-row-reverse' : 'flex-row';
}

export function getMarginClass(language: 'ar' | 'en', side: 'left' | 'right', size: number) {
  const sideMap = {
    left: language === 'ar' ? 'right' : 'left',
    right: language === 'ar' ? 'left' : 'right'
  };
  
  return `m${sideMap[side]}-${size}`;
}

export function isRTL(language: 'ar' | 'en') {
  return language === 'ar';
}
