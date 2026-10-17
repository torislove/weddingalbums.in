import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { t as translate } from '../lib/i18n';

/**
 * LanguageContext — global EN / తెలుగు (Telugu) state for the CLIENT portal.
 *
 * Back-compat:
 * - persists to the SAME localStorage key ('site_lang') the Navbar always used
 * - dispatches the SAME window 'languageChange' event legacy listeners already rely on
 * - sets <html lang="te|en"> for a11y + font switching (see index.css)
 */
const LanguageContext = createContext({ lang: 'EN', setLang: () => {}, toggleLang: () => {} });

export const readStoredLang = () => {
  try {
    return (localStorage.getItem('site_lang') || 'EN').toUpperCase() === 'TE' ? 'TE' : 'EN';
  } catch {
    return 'EN';
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  const setLang = (next) => {
    const val = String(next).toUpperCase() === 'TE' ? 'TE' : 'EN';
    setLangState(val);
    try {
      localStorage.setItem('site_lang', val);
    } catch { /* private mode */ }
    window.dispatchEvent(new Event('languageChange'));
  };

  const toggleLang = () => setLang(lang === 'EN' ? 'TE' : 'EN');

  useEffect(() => {
    document.documentElement.lang = lang === 'TE' ? 'te' : 'en';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

/**
 * useT() — returns a t(key, vars) bound to the current language, so components
 * can write `const t = useT(); ... {t('about.hero_title')}` without threading
 * `lang` through every call. Keys + Telugu live in client/src/lib/i18n.js.
 */
export const useT = () => {
  const { lang } = useLanguage();
  return useCallback((key, vars) => translate(key, lang, vars), [lang]);
};

export default LanguageContext;
