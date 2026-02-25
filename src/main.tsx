import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { LangProvider } from "./i18n/LangProvider";
import App from "./App";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <LangProvider>
        <App />
      </LangProvider>
    </ChakraProvider>
  </React.StrictMode>
);