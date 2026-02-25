import { useState } from "react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { LangContext } from "./context";
import { he } from "./he";
import { en } from "./en";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<"he" | "en">("he");
  const toggleLang = () => setLang((l) => (l === "he" ? "en" : "he"));

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      <IntlProvider messages={lang === "he" ? he : en} locale={lang} defaultLocale="he">
        <div dir={lang === "he" ? "rtl" : "ltr"} lang={lang}>
          {children}
        </div>
      </IntlProvider>
    </LangContext.Provider>
  );
}