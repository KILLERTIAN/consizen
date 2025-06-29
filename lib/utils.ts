import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as ethers from 'ethers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// USDC token contract addresses on different testnets
export const USDC_ADDRESSES = {
  // Ethereum Sepolia
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  // Polygon Mumbai
  80001: '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97',
  // Arbitrum Sepolia
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  // Base Sepolia
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  // Optimism Sepolia
  11155420: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
  // Avalanche Fuji
  43113: '0x5425890298aed601595a70AB815c96711a31Bc65',
  // Linea Sepolia
  59141: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff'
};

// ABI for ERC20 token balanceOf method
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  }
];

/**
 * Fetch USDC balance for a wallet address
 * @param address Wallet address to check
 * @param chainId Chain ID (defaults to Sepolia)
 * @param rpcUrl Optional RPC URL (if not provided, will use window.ethereum)
 * @returns Balance in USDC (formatted with decimals)
 */
export async function fetchUSDCBalance(
  address: string, 
  chainId: number = 11155111, // Default to Sepolia
  rpcUrl?: string
): Promise<{ balance: string; formatted: string; decimals: number }> {
  try {
    // Get the USDC contract address for the specified chain
    const tokenAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES];
    if (!tokenAddress) {
      throw new Error(`USDC token address not found for chain ID ${chainId}`);
    }

    // Create provider
    let provider;
    if (rpcUrl) {
      provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    } else if (typeof window !== 'undefined' && window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      throw new Error('No provider available');
    }

    // Create contract instance
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    // Get token decimals
    const decimals = await contract.decimals();

    // Fetch balance
    const balance = await contract.balanceOf(address);
    const formatted = ethers.utils.formatUnits(balance, decimals);

    return {
      balance: balance.toString(),
      formatted,
      decimals
    };
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return {
      balance: '0',
      formatted: '0.00',
      decimals: 6
    };
  }
}

export const shortenAddress = (addr: string) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};
