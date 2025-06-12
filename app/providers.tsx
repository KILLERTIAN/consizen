"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, linea, lineaSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

// Create wagmi config
const config = createConfig({
  ssr: true,
  chains: [mainnet, linea, lineaSepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  // Handle window being undefined during SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering components with potential window references until client-side
  if (!mounted) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <div style={{ visibility: "hidden" }}>{children}</div>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
