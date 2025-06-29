/**
 * LI.FI SDK Integration for Cross-Chain USDC Transfers
 * 
 * This file provides utilities for integrating with LI.FI SDK to perform cross-chain
 * USDC transfers using Circle's CCTP v2 protocol.
 */

import { createConfig, ChainId, getQuote, getStatus } from '@lifi/sdk';
import type { QuoteRequest, GetStatusRequest } from '@lifi/sdk';
import { SupportedBlockchain } from './circle';
import type { Account } from 'viem';
import { toast } from "sonner";
import axios from 'axios';

// Initialize LI.FI SDK with our integrator name
createConfig({
  integrator: 'Consizen',
  apiUrl: 'https://li.quest/v1',
});

// Chain IDs for supported blockchains
export const CHAIN_IDS: Record<SupportedBlockchain, number> = {
  [SupportedBlockchain.ETHEREUM]: ChainId.ETH,
  [SupportedBlockchain.AVALANCHE]: ChainId.AVA,
  [SupportedBlockchain.ARBITRUM]: ChainId.ARB,
  [SupportedBlockchain.OPTIMISM]: ChainId.OPT,
  [SupportedBlockchain.BASE]: ChainId.BSC,
  [SupportedBlockchain.POLYGON]: ChainId.POL,
  [SupportedBlockchain.LINEA]: 59144,
  [SupportedBlockchain.SOLANA]: 0, // Not supported in this implementation
};

// USDC token addresses on different chains
export const USDC_ADDRESSES: Record<Exclude<SupportedBlockchain, SupportedBlockchain.SOLANA>, string> = {
  [SupportedBlockchain.ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [SupportedBlockchain.AVALANCHE]: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  [SupportedBlockchain.ARBITRUM]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [SupportedBlockchain.OPTIMISM]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [SupportedBlockchain.BASE]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  [SupportedBlockchain.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [SupportedBlockchain.LINEA]: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff'
};

// Linea chain ID and USDC address
export const LINEA_CHAIN_ID = 59144; // Linea Mainnet
export const LINEA_USDC_ADDRESS = '0x176211869cA2b568f2A7D4EE941E073a821EE1ff';

/**
 * CCTP V2 Transfer Types
 */
export enum CCTPTransferType {
  STANDARD = 'standard', // Standard transfer (CCTP V1 compatible)
  FAST = 'fast'          // Fast transfer (CCTP V2 feature)
}

// Extended QuoteRequest type with CCTP options
interface ExtendedQuoteRequest extends QuoteRequest {
  options?: {
    cctp?: {
      transferType: CCTPTransferType;
      useHooks: boolean;
    };
  };
}

// Quote result interface
interface QuoteResult {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quote?: any; // Using any type since we don't have the exact Quote type from LI.FI SDK
  estimatedGasCost?: string;
  estimatedDuration?: number;
  error?: string;
}

// Li.Fi API endpoint
const LIFI_API_URL = 'https://li.quest/v1';

// Interface for transfer parameters
export interface TransferParams {
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAddress: string;
  toAddress: string;
  slippage?: number;
}

// Interface for transfer response
export interface TransferResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  data?: Record<string, unknown>;
}

// Quote response interface
export interface QuoteResponse {
  id: string;
  type: string;
  tool: string;
  action: {
    fromChainId: number;
    toChainId: number;
    fromToken: {
      address: string;
      symbol: string;
      decimals: number;
    };
    toToken: {
      address: string;
      symbol: string;
      decimals: number;
    };
    fromAmount: string;
    slippage: number;
  };
  estimate: {
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    executionDuration: number;
    gasCosts: Array<{
      token: {
        address: string;
        symbol: string;
        decimals: number;
      };
      amount: string;
      amountUSD: string;
    }>;
  };
}

// Status response interface
export interface StatusResponse {
  status: string;
  sending: {
    txHash: string;
    txLink: string;
    amount: string;
  };
  receiving: {
    txHash?: string;
    txLink?: string;
    amount?: string;
  };
}

// Token interface
export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

/**
 * Get a quote for a cross-chain transfer using Li.Fi
 * @param params Transfer parameters
 * @returns Quote information
 */
export async function getQuote(params: TransferParams): Promise<QuoteResponse> {
  try {
    const response = await axios.get(`${LIFI_API_URL}/quote`, {
      params: {
        fromChain: params.fromChain,
        toChain: params.toChain,
        fromToken: params.fromToken,
        toToken: params.toToken,
        fromAmount: params.fromAmount,
        fromAddress: params.fromAddress,
        slippage: params.slippage || 0.5
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting Li.Fi quote:', error);
    throw error;
  }
}

/**
 * Execute a cross-chain transfer using Li.Fi
 * @param params Transfer parameters
 * @returns Transfer response
 */
export async function executeTransfer(params: TransferParams): Promise<TransferResponse> {
  try {
    // First get a quote
    const quote = await getQuote(params);
    
    // Then execute the transfer
    const response = await axios.post(`${LIFI_API_URL}/transfer`, {
      quote,
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
    });

    return {
      success: true,
      transactionId: response.data.transactionId,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('Error executing Li.Fi transfer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to execute transfer'
    };
  }
}

/**
 * Get the status of a transfer
 * @param transactionId The transaction ID
 * @returns Status information
 */
export async function getTransferStatus(transactionId: string): Promise<StatusResponse> {
  try {
    const response = await axios.get(`${LIFI_API_URL}/status`, {
      params: {
        txHash: transactionId
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting transfer status:', error);
    throw error;
  }
}

/**
 * Get available token options for a specific chain
 * @param chainId The chain ID
 * @returns List of available tokens
 */
export async function getAvailableTokens(chainId: number): Promise<Token[]> {
  try {
    const response = await axios.get(`${LIFI_API_URL}/tokens`, {
      params: {
        chains: chainId
      }
    });

    return response.data.tokens[chainId.toString()];
  } catch (error) {
    console.error('Error getting available tokens:', error);
    throw error;
  }
}

/**
 * Get gas price for a specific chain
 * @param chainId The chain ID
 */
export const getChainGasPrice = async (chainId: number) => {
  try {
    // In the latest SDK, getGasPrice is not exported directly
    // We would need to implement this using a provider
    
    // For demonstration purposes, we'll return a mock gas price
    const mockGasPrice = '20000000000'; // 20 Gwei
    const gasPriceInGwei = parseInt(mockGasPrice) / 1e9;
    
    return {
      success: true,
      gasPrice: mockGasPrice,
      formattedGasPrice: `${gasPriceInGwei.toFixed(2)} Gwei`
    };
  } catch (error) {
    console.error('Error getting gas price:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get gas price'
    };
  }
};

// LiFi API service for cross-chain transfers

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

/**
 * Get supported chains from LI.FI
 */
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

/**
 * Get tokens for a specific chain
 */
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

/**
 * Get USDC token for a specific chain
 */
export const getUSDCForChain = async (chainId: number): Promise<TokenInfo | null> => {
  try {
    const tokens = await getTokensForChain(chainId);
    return tokens.find(token => token.symbol === "USDC") || null;
  } catch (error) {
    console.error(`Error finding USDC for chain ${chainId}:`, error);
    return null;
  }
};

/**
 * Get available routes for a cross-chain transfer
 */
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

/**
 * Simulate getting chain and token data for the demo
 */
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