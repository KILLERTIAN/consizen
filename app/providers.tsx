"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { Toaster } from "@/components/ui/sonner";

// Define Linea Sepolia chain
const lineaSepolia = {
  id: 59141,
  name: "Linea Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.linea.build"] },
    public: { http: ["https://rpc.sepolia.linea.build"] },
  },
  blockExplorers: {
    default: { name: "Lineascan", url: "https://sepolia.lineascan.build" },
  },
  testnet: true,
} as const;

// Create wagmi config with testnet chains only
const config = createConfig({
  ssr: true,
  chains: [sepolia, lineaSepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
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
          <Toaster />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
