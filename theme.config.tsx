import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";

import { Logo } from "./components/Logo";

const config: DocsThemeConfig = {
  // Global
  docsRepositoryBase: "https://github.com/dydxopsdao/v4-documentation/tree/main",
  feedback: { content: null }, // disable until we have a feedback channel
  useNextSeoProps: () => {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s · dYdX · Chain",
      };
    }
  },
  head: () => {
    const { title } = useConfig();
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="og:title"
          content={title ? title + " · dYdX · Chain" : "dYdX · Chain"}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </>
    );
  },

  // Theming
  primaryHue: 241.18,
  darkMode: false,
  nextThemes: {
    forcedTheme: "dark",
  },
  // Navbar
  logo: <Logo />,
  project: {},
  chat: {},
  banner: {
    key: "v3-docs-redirect-mainnet1",
    text: (
      <span className="banner">
        ✨ Join our forum!{" "}
        <button
          onClick={() => window.open("https://dydx.forum", "_blank")}
          className="banner-button"
        >
          dYdX Forum
        </button>
      </span>
    ),
    dismissible: true,
  },

  // Footer
  footer: {
    component: null,
  },
};

export default config;
