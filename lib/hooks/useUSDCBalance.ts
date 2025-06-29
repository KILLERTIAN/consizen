"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchUSDCBalance } from '@/lib/utils';
import { toast } from 'sonner';
import { executeTransfer, getRoutes, RouteOptions } from '@/lib/api/lifi-service';

interface UseUSDCBalanceProps {
  walletAddress: string | null;
  chainId?: number;
  autoTopUp?: boolean;
  topUpThreshold?: number;
  topUpAmount?: number;
}

interface UseUSDCBalanceReturn {
  balance: string;
  formattedBalance: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  executeTopUp: (amount: number) => Promise<boolean>;
}

/**
 * Hook for managing USDC balances and automatic top-ups
 */
export function useUSDCBalance({
  walletAddress,
  chainId = 11155111, // Default to Sepolia
  autoTopUp = false,
  topUpThreshold = 50,
  topUpAmount = 100
}: UseUSDCBalanceProps): UseUSDCBalanceReturn {
  const [balance, setBalance] = useState<string>('0');
  const [formattedBalance, setFormattedBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTopUpTime, setLastTopUpTime] = useState<number | null>(null);

  // Function to fetch the USDC balance
  const fetchBalance = useCallback(async () => {
    if (!walletAddress) {
      setError('No wallet address provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchUSDCBalance(walletAddress, chainId);
      setBalance(result.balance);
      setFormattedBalance(result.formatted);
    } catch (err) {
      console.error('Error fetching USDC balance:', err);
      setError('Failed to fetch USDC balance');
      toast.error('Failed to fetch USDC balance');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, chainId]);

  // Function to execute a top-up
  const executeTopUp = useCallback(async (amount: number): Promise<boolean> => {
    if (!walletAddress) {
      toast.error('No wallet address provided');
      return false;
    }

    setIsLoading(true);
    try {
      // Get USDC addresses for source and destination chains
      const fromTokenAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC
      const toTokenAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC
      
      // Create route options
      const routeOptions: RouteOptions = {
        fromChainId: 11155111, // Sepolia
        toChainId: chainId,
        fromTokenAddress,
        toTokenAddress,
        fromAmount: (amount * 1000000).toString(), // Convert to USDC decimals (6)
        fromAddress: walletAddress,
        toAddress: walletAddress
      };
      
      // Get available routes
      const routes = await getRoutes(routeOptions);
      
      if (routes.length === 0) {
        toast.error('No available routes for transfer');
        return false;
      }
      
      // Execute the transfer using the first route
      const result = await executeTransfer(routes[0].id, walletAddress);
      
      if (result.success) {
        toast.success(`Successfully topped up ${amount} USDC`);
        setLastTopUpTime(Date.now());
        
        // Refetch balance after top-up
        await fetchBalance();
        return true;
      } else {
        toast.error('Failed to execute top-up');
        return false;
      }
    } catch (err) {
      console.error('Error executing top-up:', err);
      toast.error('Failed to execute top-up');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, chainId, fetchBalance]);

  // Check if balance is below threshold and execute auto top-up if needed
  useEffect(() => {
    const checkBalanceAndTopUp = async () => {
      if (!autoTopUp || !walletAddress || isLoading) return;
      
      // Don't auto top-up more than once per hour
      if (lastTopUpTime && Date.now() - lastTopUpTime < 60 * 60 * 1000) return;

      const balanceNum = parseFloat(formattedBalance);
      if (balanceNum < topUpThreshold) {
        toast.info(`USDC balance (${balanceNum.toFixed(2)}) below threshold (${topUpThreshold}). Initiating auto top-up.`);
        await executeTopUp(topUpAmount);
      }
    };

    checkBalanceAndTopUp();
  }, [autoTopUp, walletAddress, formattedBalance, topUpThreshold, topUpAmount, lastTopUpTime, executeTopUp, isLoading]);

  // Fetch balance on mount and when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
    }
  }, [walletAddress, fetchBalance]);

  return {
    balance,
    formattedBalance,
    isLoading,
    error,
    refetch: fetchBalance,
    executeTopUp
  };
}

export default useUSDCBalance; 