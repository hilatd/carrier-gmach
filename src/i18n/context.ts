import { createContext } from "react";

type Lang = "he" | "en";

export interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
}

export const LangContext = createContext<LangContextType>({
  lang: "he",
  toggleLang: () => {},
});