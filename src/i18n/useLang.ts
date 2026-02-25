import { useContext } from "react";
import { LangContext } from "./context";

export const useLang = () => useContext(LangContext);