// LiFi API service for cross-chain transfers
import { toast } from "sonner";

// LiFi API endpoints
const LIFI_API_URL = "https://li.quest/v1";

// Types
export interface ChainInfo {
  id: number;
  name: string;
  chainId: number;
  logoURI: string;
  tokenSymbol: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  name: string;
  logoURI: string;
}

export interface RouteOptions {
  fromChainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromAmount: string;
  fromAddress: string;
  toAddress: string;
}

export interface Route {
  id: string;
  fromChainId: number;
  toChainId: number;
  fromAmount: string;
  toAmount: string;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  steps: any[];
  gasEstimated: string;
  estimatedDurationInSeconds: number;
}

// Get supported chains
export const getSupportedChains = async (): Promise<ChainInfo[]> => {
  try {
    const response = await fetch(`${LIFI_API_URL}/chains`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chains: ${response.statusText}`);
    }
    const data = await response.json();
    return data.chains;
  } catch (error) {
    console.error("Error fetching supported chains:", error);
    toast.error("Failed to fetch supported chains");
    return [];
  }
};

// Get tokens for a specific chain
export const getTokensForChain = async (chainId: number): Promise<TokenInfo[]> => {
  try {
    const response = await fetch(`${LIFI_API_URL}/tokens?chains=${chainId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tokens[chainId] || [];
  } catch (error) {
    console.error(`Error fetching tokens for chain ${chainId}:`, error);
    toast.error("Failed to fetch tokens");
    return [];
  }
};

// Get USDC token for a specific chain
export const getUSDCForChain = async (chainId: number): Promise<TokenInfo | null> => {
  try {
    const tokens = await getTokensForChain(chainId);
    return tokens.find(token => token.symbol === "USDC") || null;
  } catch (error) {
    console.error(`Error finding USDC for chain ${chainId}:`, error);
    return null;
  }
};

// Get available routes for a cross-chain transfer
export const getRoutes = async (options: RouteOptions): Promise<Route[]> => {
  try {
    const response = await fetch(`${LIFI_API_URL}/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Failed to get routes: ${response.statusText}`);
    }

    const data = await response.json();
    return [data]; // LiFi returns a single optimal route
  } catch (error) {
    console.error("Error getting routes:", error);
    toast.error("Failed to get transfer routes");
    return [];
  }
};

// Execute a cross-chain transfer
export const executeTransfer = async (routeId: string, fromAddress: string): Promise<{success: boolean, txHash: string, routeId: string}> => {
  try {
    // In a real implementation, this would call the LiFi API to execute the transfer
    // For this demo, we'll simulate a successful transfer
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      routeId,
    };
  } catch (error) {
    console.error("Error executing transfer:", error);
    toast.error("Failed to execute transfer");
    throw error;
  }
};

// Get the status of a transfer
export const getTransferStatus = async (routeId: string): Promise<{status: string, txHash?: string}> => {
  try {
    const response = await fetch(`${LIFI_API_URL}/status?id=${routeId}`);
    if (!response.ok) {
      throw new Error(`Failed to get transfer status: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting transfer status:", error);
    toast.error("Failed to get transfer status");
    throw error;
  }
};

// Simulate getting chain and token data for the demo
export const getSimulatedChainData = (): { chains: ChainInfo[], tokens: Record<number, TokenInfo[]> } => {
  const chains = [
    {
      id: 1,
      name: "Ethereum",
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg",
      tokenSymbol: "ETH"
    },
    {
      id: 137,
      name: "Polygon",
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg",
      tokenSymbol: "MATIC"
    },
    {
      id: 43114,
      name: "Avalanche",
      chainId: 43114,
      logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/avalanche.svg",
      tokenSymbol: "AVAX"
    },
    {
      id: 42161,
      name: "Arbitrum",
      chainId: 42161,
      logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg",
      tokenSymbol: "ETH"
    },
    {
      id: 10,
      name: "Optimism",
      chainId: 10,
      logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg",
      tokenSymbol: "ETH"
    }
  ];

  const tokens: Record<number, TokenInfo[]> = {};
  
  // Add USDC to each chain
  chains.forEach(chain => {
    tokens[chain.chainId] = [
      {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // ETH USDC address (just an example)
        symbol: "USDC",
        decimals: 6,
        chainId: chain.chainId,
        name: "USD Coin",
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
      }
    ];
  });

  return { chains, tokens };
};

 
 