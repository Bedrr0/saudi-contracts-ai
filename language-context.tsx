"use client";

import { createContext, useContext, useState } from "react";

export type LanguageContextType = {
  language: string;
  toggleLanguage: () => void;
};

const defaultLanguageContext: LanguageContextType = {
  language: "ar", // Default to Arabic
  toggleLanguage: () => {},
};

export const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>("ar"); // Default to Arabic

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
