/**
 * React hook for using Circle Wallet functionality
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  AccountType,
  SupportedBlockchain, 
  WalletType, 
  createUserWallet, 
  getWalletDetails, 
  getWalletBalances, 
  createCCTPTransfer,
  mintUSDC,
  getWalletTransactions,
  CCTPTransferMode,
  createGasPolicy,
  GasPolicyType
} from '@/lib/api/circle';

// Define types for Circle Wallet objects
export interface CircleWallet {
  id: string;
  walletSetId?: string;
  custodyType: string;
  address: string;
  blockchain: SupportedBlockchain;
  updateDate: string;
  createDate: string;
  state: string;
  metadata?: Record<string, string>;
}

export interface TokenBalance {
  id: string;
  tokenId: string;
  amount: string;
  updateDate: string;
  blockchain: SupportedBlockchain;
}

export interface Transaction {
  id: string;
  walletId: string;
  tokenId: string;
  state: string;
  amount: string;
  blockchain: SupportedBlockchain;
  type: string;
  createDate: string;
  updateDate: string;
  source?: {
    address: string;
    blockchain: SupportedBlockchain;
  };
  destination?: {
    address: string;
    blockchain: SupportedBlockchain;
  };
}

interface CircleWalletState {
  isInitialized: boolean;
  isLoading: boolean;
  wallets: CircleWallet[];
  selectedWallet: CircleWallet | null;
  balances: TokenBalance[];
  transactions: Transaction[];
  error: string | null;
}

interface UseCircleWalletOptions {
  userId?: string;
  autoInitialize?: boolean;
  defaultBlockchains?: SupportedBlockchain[];
  walletType?: WalletType;
}

export function useCircleWallet({
  userId = '',
  autoInitialize = false,
  defaultBlockchains = [SupportedBlockchain.ETHEREUM, SupportedBlockchain.LINEA],
  walletType = WalletType.USER_CONTROLLED
}: UseCircleWalletOptions = {}) {
  const [state, setState] = useState<CircleWalletState>({
    isInitialized: false,
    isLoading: false,
    wallets: [],
    selectedWallet: null,
    balances: [],
    transactions: [],
    error: null,
  });

  // Initialize wallet
  const initializeWallet = useCallback(async (
    userIdentifier: string = userId,
    blockchains: SupportedBlockchain[] = defaultBlockchains
  ) => {
    if (!userIdentifier) {
      toast.error('User ID is required to initialize a wallet');
      setState(prev => ({
        ...prev,
        error: 'User ID is required to initialize a wallet'
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    toast.loading('Creating your Circle wallet...');

    try {
      const result = await createUserWallet(
        userIdentifier,
        blockchains
      );

      if (result.success) {
        toast.success('Circle wallet created successfully!');
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
          wallets: result.wallets as CircleWallet[],
          selectedWallet: (result.wallets[0] as CircleWallet) || null,
        }));

        // If we have a wallet, fetch its balances
        if (result.wallets[0]?.id) {
          fetchBalances(result.wallets[0].id);
          fetchTransactions(result.wallets[0].id);
        }
      } else {
        toast.error(result.error || 'Failed to initialize wallet');
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to initialize wallet'
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error initializing wallet';
      toast.error(errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error initializing wallet'
      }));
    }
  }, [userId, defaultBlockchains, walletType]);

  // Fetch wallet details
  const fetchWalletDetails = useCallback(async (walletId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getWalletDetails(walletId);

      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          selectedWallet: result.wallet as CircleWallet,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to fetch wallet details'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error fetching wallet details'
      }));
    }
  }, []);

  // Fetch wallet balances
  const fetchBalances = useCallback(async (walletId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getWalletBalances(walletId);

      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          balances: result.balances as TokenBalance[],
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to fetch balances'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error fetching balances'
      }));
    }
  }, []);

  // Fetch wallet transactions
  const fetchTransactions = useCallback(async (walletId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getWalletTransactions(walletId);

      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          transactions: result.transactions as Transaction[],
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to fetch transactions'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error fetching transactions'
      }));
    }
  }, []);

  // Create CCTP transfer
  const createTransfer = useCallback(async (
    amount: string,
    destinationAddress: string,
    destinationChain: SupportedBlockchain,
    mode: CCTPTransferMode = CCTPTransferMode.STANDARD
  ) => {
    if (!state.selectedWallet) {
      toast.error('No wallet selected');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    toast.loading('Initiating transfer...');

    try {
      const result = await createCCTPTransfer(
        state.selectedWallet.id,
        amount,
        destinationAddress,
        destinationChain,
        mode
      );

      if (result.success) {
        toast.success('Transfer initiated successfully!');
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));

        // Refresh transactions
        fetchTransactions(state.selectedWallet.id);
      } else {
        toast.error(result.error || 'Failed to initiate transfer');
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to initiate transfer'
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error initiating transfer';
      toast.error(errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [state.selectedWallet]);

  // Mint USDC
  const mintTokens = useCallback(async (amount: string) => {
    if (!state.selectedWallet) {
      toast.error('No wallet selected');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    toast.loading('Minting USDC...');

    try {
      const result = await mintUSDC(state.selectedWallet.id, amount);

      if (result.success) {
        toast.success('USDC minted successfully!');
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));

        // Refresh balances
        fetchBalances(state.selectedWallet.id);
      } else {
        toast.error(result.error || 'Failed to mint USDC');
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to mint USDC'
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error minting USDC';
      toast.error(errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [state.selectedWallet]);

  // Create gas policy
  const createPolicy = useCallback(async (
    policyType: GasPolicyType,
    params: Record<string, unknown>
  ) => {
    if (!state.selectedWallet) {
      toast.error('No wallet selected');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    toast.loading('Creating gas policy...');

    try {
      const result = await createGasPolicy(state.selectedWallet.id, policyType, params);

      if (result.success) {
        toast.success('Gas policy created successfully!');
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      } else {
        toast.error(result.error || 'Failed to create gas policy');
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to create gas policy'
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error creating gas policy';
      toast.error(errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [state.selectedWallet]);

  return {
    ...state,
    initializeWallet,
    fetchWalletDetails,
    fetchBalances,
    fetchTransactions,
    createTransfer,
    mintTokens,
    createPolicy,
  };
} 