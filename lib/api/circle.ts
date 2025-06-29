/**
 * Circle Wallet and CCTP v2 API Integration
 * 
 * This file provides utilities for integrating with Circle's Programmable Wallets API
 * and Cross-Chain Transfer Protocol (CCTP) v2 for the Consizen application.
 */

import axios from 'axios';
import { toast } from "sonner";

// API URLs
const CIRCLE_API_URL = process.env.NEXT_PUBLIC_CIRCLE_API_URL || 'https://api-sandbox.circle.com';

// Supported blockchains for Circle wallets
export enum SupportedBlockchain {
  ETHEREUM = 'ETH',
  AVALANCHE = 'AVAX',
  ARBITRUM = 'ARB',
  OPTIMISM = 'OPT',
  BASE = 'BASE',
  POLYGON = 'MATIC',
  SOLANA = 'SOL',
  LINEA = 'LINEA',
}

// Chain IDs for supported blockchains
export const CHAIN_IDS: Record<SupportedBlockchain, number> = {
  [SupportedBlockchain.ETHEREUM]: 1,
  [SupportedBlockchain.AVALANCHE]: 43114,
  [SupportedBlockchain.ARBITRUM]: 42161,
  [SupportedBlockchain.OPTIMISM]: 10,
  [SupportedBlockchain.BASE]: 8453,
  [SupportedBlockchain.POLYGON]: 137,
  [SupportedBlockchain.LINEA]: 59144,
  [SupportedBlockchain.SOLANA]: 0, // Solana doesn't use EVM chain IDs
};

// Testnet RPC URLs for supported blockchains
export const TESTNET_RPC_URLS: Record<
  | SupportedBlockchain.ETHEREUM
  | SupportedBlockchain.AVALANCHE
  | SupportedBlockchain.ARBITRUM
  | SupportedBlockchain.OPTIMISM
  | SupportedBlockchain.BASE
  | SupportedBlockchain.POLYGON
  | SupportedBlockchain.LINEA,
  string
> = {
  [SupportedBlockchain.ETHEREUM]: "https://sepolia.infura.io/v3/",
  [SupportedBlockchain.AVALANCHE]: "https://api.avax-test.network/ext/bc/C/rpc",
  [SupportedBlockchain.ARBITRUM]: "https://sepolia-rollup.arbitrum.io/rpc",
  [SupportedBlockchain.OPTIMISM]: "https://sepolia.optimism.io",
  [SupportedBlockchain.BASE]: "https://sepolia.base.org",
  [SupportedBlockchain.POLYGON]: "https://rpc-amoy.polygon.technology",
  [SupportedBlockchain.LINEA]: "https://rpc.goerli.linea.build",
};

// Wallet types for application usage
export enum WalletType {
  USER_CONTROLLED = 'user', 
  DEVELOPER_CONTROLLED = 'developer',
}

// Account types for Circle wallets
export enum AccountType {
  EOA = 'EOA', // Externally Owned Account
  SCA = 'SCA', // Smart Contract Account (only available on EVM chains)
}

// CCTP Transfer modes
export enum CCTPTransferMode {
  STANDARD = 'standard',
  FAST = 'fast',
}

// Gas policy types
export enum GasPolicyType {
  STANDARD = 'standard',
  FAST = 'fast',
}

// Types for Circle API
export interface CircleWallet {
  id: string;
  name: string;
  address: string;
  chain: string;
  balance?: string;
}

export interface CCTPTransferParams {
  amount: number;
  destinationAddress: string;
  destinationChain: string;
  sourceChain?: string;
}

export interface MintParams {
  amount: number;
  destinationAddress?: string;
  chain?: string;
}

// Circle API client with authentication
const circleApi = axios.create({
  baseURL: CIRCLE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_API_KEY}`,
  },
});

// Add response interceptor for better error handling
circleApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Circle API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Create a new Circle wallet for a user
 * 
 * @param userId User identifier
 * @param blockchains Array of blockchains to support in the wallet
 * @param walletType Type of wallet (user or developer)
 * @param idempotencyKey Unique key to prevent duplicate wallet creation
 */
export async function createUserWallet(
  userId: string,
  blockchains: SupportedBlockchain[] = [SupportedBlockchain.ETHEREUM],
  walletType: WalletType = WalletType.USER_CONTROLLED,
  idempotencyKey: string = `wallet-${userId}-${Date.now()}`
) {
  try {
    console.log(`Creating ${walletType} wallet for user ${userId} with blockchains:`, blockchains);
    
    // Create wallets for each blockchain
    const walletPromises = blockchains.map(async (blockchain) => {
      const walletResponse = await circleApi.post('/v1/w3s/wallets', {
        idempotencyKey: `${idempotencyKey}-${blockchain}`,
        accountType: AccountType.EOA,
        blockchains: [blockchain],
        metadata: {
          email: `user-${userId}@consizen.app`,
          userId,
        },
      });
      
      return walletResponse.data?.data?.wallets?.[0];
    });
    
    const wallets = await Promise.all(walletPromises);
    
    console.log(`Successfully created ${wallets.length} wallets`);
    
    return {
      success: true,
      wallets: wallets.filter(Boolean),
    };
  } catch (error) {
    console.error('Error creating Circle wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create wallet',
    };
  }
}

/**
 * Create a developer-controlled wallet for batch operations
 * 
 * @param entitySecretCiphertext Entity secret ciphertext for authentication
 * @param blockchains Array of blockchains to support in the wallet
 * @param idempotencyKey Unique key to prevent duplicate wallet creation
 */
export async function createDeveloperWallet(
  entitySecretCiphertext: string,
  blockchains: SupportedBlockchain[] = [SupportedBlockchain.ETHEREUM],
  idempotencyKey: string = `dev-wallet-${Date.now()}`
) {
  try {
    console.log(`Creating developer wallet with blockchains:`, blockchains);
    
    // Create a wallet set for the application
    const walletSetResponse = await circleApi.post('/v1/w3s/developer/walletSets', {
      idempotencyKey,
      entitySecretCiphertext,
    });

    if (!walletSetResponse.data?.data?.walletSet?.id) {
      throw new Error('Failed to create wallet set');
    }

    const walletSetId = walletSetResponse.data.data.walletSet.id;
    
    // Create wallets for each blockchain
    const walletPromises = blockchains.map(async (blockchain) => {
      const walletResponse = await circleApi.post('/v1/w3s/developer/wallets', {
        idempotencyKey: `${idempotencyKey}-${blockchain}`,
        walletSetId,
        blockchains: [blockchain],
      });
      
      return walletResponse.data?.data?.wallets?.[0];
    });
    
    const wallets = await Promise.all(walletPromises);
    
    console.log(`Successfully created developer wallet set with ID: ${walletSetId}`);
    
    return {
      success: true,
      walletSetId,
      wallets: wallets.filter(Boolean),
    };
  } catch (error) {
    console.error('Error creating developer Circle wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create developer wallet',
    };
  }
}

/**
 * Get wallet details
 * 
 * @param walletId Wallet ID to retrieve
 */
export async function getWalletDetails(walletId: string) {
  try {
    console.log(`Fetching wallet details for ID: ${walletId}`);
    
    const response = await circleApi.get(`/v1/w3s/wallets/${walletId}`);
    
    return {
      success: true,
      wallet: response.data?.data?.wallet,
    };
  } catch (error) {
    console.error('Error getting wallet details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get wallet details',
    };
  }
}

/**
 * Get USDC balances for a wallet
 * 
 * @param walletId Wallet ID to check balances for
 */
export async function getWalletBalances(walletId: string) {
  try {
    console.log(`Fetching balances for wallet ID: ${walletId}`);
    
    const response = await circleApi.get(`/v1/w3s/wallets/${walletId}/balances`, {
      params: {
        tokenId: 'USDC', // Filter for USDC only
      }
    });
    
    return {
      success: true,
      balances: response.data?.data?.tokenBalances || [],
    };
  } catch (error) {
    console.error('Error getting wallet balances:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get wallet balances',
    };
  }
}

/**
 * Mint USDC to a Circle wallet (for developer wallets)
 * 
 * @param walletId Destination wallet ID
 * @param amount Amount to mint (as string)
 * @param idempotencyKey Unique key to prevent duplicate minting
 */
export async function mintUSDC(
  walletId: string,
  amount: string,
  idempotencyKey: string = `mint-${Date.now()}`
) {
  try {
    console.log(`Minting ${amount} USDC to wallet ID: ${walletId}`);
    
    const response = await circleApi.post('/v1/w3s/developer/transactions/mint', {
      idempotencyKey,
      destinationWalletId: walletId,
      tokenId: 'USDC',
      amount,
    });
    
    return {
      success: true,
      transaction: response.data?.data?.transaction,
    };
  } catch (error) {
    console.error('Error minting USDC:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint USDC',
    };
  }
}

/**
 * Create a CCTP v2 cross-chain transfer
 * 
 * @param sourceWalletId Source wallet ID
 * @param destinationAddress Destination address on target chain
 * @param sourceChain Source blockchain
 * @param destinationChain Destination blockchain
 * @param amount Amount to transfer (as string)
 * @param mode CCTP transfer mode (standard or fast)
 * @param useHooks Whether to use CCTP hooks for post-transfer actions
 * @param idempotencyKey Unique key to prevent duplicate transfers
 */
export async function createCCTPTransfer(
  sourceWalletId: string,
  destinationAddress: string,
  sourceChain: SupportedBlockchain,
  destinationChain: SupportedBlockchain,
  amount: string,
  mode: CCTPTransferMode = CCTPTransferMode.FAST,
  useHooks: boolean = false,
  idempotencyKey: string = `cctp-${Date.now()}`
) {
  try {
    console.log(`Creating CCTP transfer of ${amount} USDC from ${sourceChain} to ${destinationChain}`);
    console.log(`Mode: ${mode}, Hooks enabled: ${useHooks}`);
    
    const response = await circleApi.post('/v1/w3s/transactions/transfer', {
      idempotencyKey,
      sourceWalletId,
      destinationAddress,
      sourceBlockchain: sourceChain,
      destinationBlockchain: destinationChain,
      tokenId: 'USDC',
      amount,
      feeLevel: mode === CCTPTransferMode.FAST ? 'HIGH' : 'MEDIUM',
      useHooks,
    });
    
    return {
      success: true,
      transfer: response.data?.data?.transfer,
      estimatedCompletionTime: mode === CCTPTransferMode.FAST ? '10-30 seconds' : '5-20 minutes',
    };
  } catch (error) {
    console.error('Error creating CCTP transfer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create CCTP transfer',
    };
  }
}

/**
 * Create a gas policy for a wallet
 * 
 * @param walletId Wallet ID to create policy for
 * @param policyType Type of gas policy
 * @param idempotencyKey Unique key to prevent duplicate policy creation
 */
export async function createGasPolicy(
  walletId: string,
  policyType: GasPolicyType = GasPolicyType.STANDARD,
  idempotencyKey: string = `gas-policy-${Date.now()}`
) {
  try {
    console.log(`Creating gas policy for wallet ID: ${walletId}, type: ${policyType}`);
    
    const response = await circleApi.post('/v1/w3s/gasStation/policies', {
      idempotencyKey,
      walletId,
      policyType,
    });
    
    return {
      success: true,
      policy: response.data?.data?.policy,
    };
  } catch (error) {
    console.error('Error creating gas policy:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create gas policy',
    };
  }
}

/**
 * Get transaction status
 * 
 * @param transactionId Transaction ID to check
 */
export async function getTransactionStatus(transactionId: string) {
  try {
    console.log(`Checking status for transaction ID: ${transactionId}`);
    
    const response = await circleApi.get(`/v1/w3s/transactions/${transactionId}`);
    
    return {
      success: true,
      transaction: response.data?.data?.transaction,
    };
  } catch (error) {
    console.error('Error getting transaction status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction status',
    };
  }
}

/**
 * Get list of transactions for a wallet
 * 
 * @param walletId Wallet ID to get transactions for
 * @param pageSize Number of transactions to return (default: 10)
 */
export async function getWalletTransactions(walletId: string, pageSize: number = 10) {
  try {
    console.log(`Fetching transactions for wallet ID: ${walletId}`);
    
    const response = await circleApi.get(`/v1/w3s/wallets/${walletId}/transactions`, {
      params: {
        pageSize,
      }
    });
    
    return {
      success: true,
      transactions: response.data?.data?.transactions || [],
    };
  } catch (error) {
    console.error('Error getting wallet transactions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get wallet transactions',
    };
  }
}

// Mock Circle API service
export class CircleService {
  private apiKey: string;
  private baseUrl: string;
  private mockWallets: CircleWallet[] = [];

  constructor(apiKey: string = "", baseUrl: string = "https://api.circle.com/v1") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;

    // Initialize with a mock wallet
    this.mockWallets.push({
      id: "wallet_1",
      name: "My Circle Wallet",
      address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      chain: "ETH-SEPOLIA",
    });
  }

  // Create a new wallet
  async createWallet(name: string): Promise<CircleWallet> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newWallet: CircleWallet = {
        id: `wallet_${this.mockWallets.length + 1}`,
        name,
        address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        chain: "ETH-SEPOLIA",
      };
      
      this.mockWallets.push(newWallet);
      return newWallet;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  // Get all wallets
  async getWallets(): Promise<CircleWallet[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add random balances to wallets
      return this.mockWallets.map(wallet => ({
        ...wallet,
        balance: (Math.random() * 1000).toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching wallets:", error);
      throw new Error("Failed to fetch wallets");
    }
  }

  // Transfer USDC using CCTP v2
  async transferUSDC(params: CCTPTransferParams): Promise<{ txHash: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      
      return { txHash };
    } catch (error) {
      console.error("Error transferring USDC:", error);
      throw new Error("Failed to transfer USDC");
    }
  }

  // Mint USDC (simulated)
  async mintUSDC(params: MintParams): Promise<{ txHash: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      
      return { txHash };
    } catch (error) {
      console.error("Error minting USDC:", error);
      throw new Error("Failed to mint USDC");
    }
  }

  // Get transaction status
  async getTransactionStatus(txHash: string): Promise<{ status: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly return completed or pending
      const status = Math.random() > 0.3 ? "completed" : "pending";
      
      return { status };
    } catch (error) {
      console.error("Error getting transaction status:", error);
      throw new Error("Failed to get transaction status");
    }
  }

  // Get CCTP attestation
  async getCCTPAttestation(txHash: string, sourceChain: string, destinationChain: string): Promise<{ attestation: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock attestation
      const attestation = `0x${Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      
      return { attestation };
    } catch (error) {
      console.error("Error getting CCTP attestation:", error);
      throw new Error("Failed to get CCTP attestation");
    }
  }

  // Redeem CCTP transfer
  async redeemCCTPTransfer(attestation: string, destinationChain: string): Promise<{ txHash: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      
      return { txHash };
    } catch (error) {
      console.error("Error redeeming CCTP transfer:", error);
      throw new Error("Failed to redeem CCTP transfer");
    }
  }
}

// Create and export a singleton instance
export const circleService = new CircleService();

// Helper function to get a formatted chain name
export const getChainName = (chain: SupportedBlockchain): string => {
  switch (chain) {
    case SupportedBlockchain.ETHEREUM:
      return "Ethereum";
    case SupportedBlockchain.AVALANCHE:
      return "Avalanche";
    case SupportedBlockchain.ARBITRUM:
      return "Arbitrum";
    case SupportedBlockchain.OPTIMISM:
      return "Optimism";
    case SupportedBlockchain.BASE:
      return "Base";
    case SupportedBlockchain.POLYGON:
      return "Polygon";
    case SupportedBlockchain.LINEA:
      return "Linea";
    case SupportedBlockchain.SOLANA:
      return "Solana";
    default:
      return "Unknown";
  }
}; 
 
 