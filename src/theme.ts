import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system", // respects user's OS dark/light preference
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  direction: "rtl",
  colors: {
    brand: {
      50: "#f5eeff",
      100: "#e8d5ff",
      200: "#d0aaff",
      300: "#b57eff",
      400: "#9a52ff",
      500: "#6d4c8e", // your main purple
      600: "#5a3a78",
      700: "#462c60",
      800: "#321f47",
      900: "#1e1030",
    },
  },
  fonts: {
    heading: "'Segoe UI', sans-serif",
    body: "'Segoe UI', sans-serif",
  },
  components: {
    Button: {
      defaultProps: { colorScheme: "brand" },
    },
  },
});

export default theme;
