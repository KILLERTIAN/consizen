import { useState, useEffect, useCallback } from 'react';
import { useCircleWallet } from './useCircleWallet';
import { SupportedBlockchain } from '@/lib/api/circle';
import { CHAIN_IDS, getChainGasPrice, getTransferQuote, executeTransfer, CCTPTransferType } from '@/lib/api/lifi';
import { useAccount, useBalance, useChainId, usePublicClient } from 'wagmi';

// Configuration options for the AutoTopAgent
interface AutoTopAgentConfig {
  // The minimum balance threshold that triggers a top-up (in USDC)
  minimumBalance: number;
  
  // Buffer amount to add to predicted spend when calculating top-up amount (in USDC)
  buffer: number;
  
  // Gas price threshold in Gwei - only execute transfers when gas is below this
  lowGasThreshold: number;
  
  // Source chain to transfer USDC from
  sourceChain: SupportedBlockchain;
  
  // CCTP transfer type (fast or standard)
  cctpTransferType: CCTPTransferType;
  
  // Whether to use CCTP hooks for post-transfer actions
  useCCTPHooks: boolean;
  
  // Whether the agent is enabled
  enabled: boolean;
  
  // Check interval in milliseconds
  checkInterval: number;
}

// Default configuration
const DEFAULT_CONFIG: AutoTopAgentConfig = {
  minimumBalance: 50, // $50 USDC
  buffer: 25, // $25 USDC buffer
  lowGasThreshold: 30, // 30 Gwei
  sourceChain: SupportedBlockchain.ETHEREUM,
  cctpTransferType: CCTPTransferType.FAST,
  useCCTPHooks: false,
  enabled: true,
  checkInterval: 5 * 60 * 1000, // Check every 5 minutes
};

// Transaction history for prediction
interface Transaction {
  amount: number;
  timestamp: number;
}

// Agent action log entry
interface AgentAction {
  type: 'check' | 'top-up' | 'error';
  timestamp: number;
  message: string;
  details?: Record<string, any>;
}

/**
 * Hook for the AutoTopAgent that monitors balances and gas prices
 * to automatically top up USDC when needed
 */
export function useAutoTopAgent(config: Partial<AutoTopAgentConfig> = {}) {
  // For backwards compatibility
  if ('useFastCCTP' in config && config.cctpTransferType === undefined) {
    config.cctpTransferType = config.useFastCCTP ? CCTPTransferType.FAST : CCTPTransferType.STANDARD;
  }
  
  // Merge provided config with defaults
  const agentConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [predictedSpend, setPredictedSpend] = useState<number>(0);
  const [currentGasPrice, setCurrentGasPrice] = useState<string>('0');
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [actionLog, setActionLog] = useState<AgentAction[]>([]);
  const [lastTopUp, setLastTopUp] = useState<number | null>(null);
  const [nextCheckTime, setNextCheckTime] = useState<number | null>(null);
  
  // Hooks
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { usdcBalances, isInitialized: isCircleInitialized } = useCircleWallet({ walletAddress: address || null });
  
  // Get USDC balance for Linea chain
  const { data: lineaBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: 59144, // Linea chain ID
    token: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', // USDC on Linea
    enabled: !!address && isRunning,
  });
  
  // Get USDC balance for source chain
  const { data: sourceChainBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: CHAIN_IDS[agentConfig.sourceChain],
    token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum (or appropriate chain)
    enabled: !!address && isRunning,
  });
  
  // Add a log entry
  const addLog = useCallback((type: AgentAction['type'], message: string, details?: Record<string, any>) => {
    const logEntry: AgentAction = {
      type,
      timestamp: Date.now(),
      message,
      details,
    };
    
    setActionLog(prev => [logEntry, ...prev].slice(0, 100)); // Keep last 100 entries
    return logEntry;
  }, []);
  
  // Predict daily spend based on transaction history
  const predictDailySpend = useCallback(() => {
    if (transactionHistory.length === 0) {
      return agentConfig.minimumBalance / 2; // Default prediction if no history
    }
    
    // Calculate average daily spend over the last 7 days
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const recentTransactions = transactionHistory.filter(tx => tx.timestamp > oneWeekAgo);
    if (recentTransactions.length === 0) return agentConfig.minimumBalance / 2;
    
    const totalSpent = recentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const dailyAverage = totalSpent / 7;
    
    return Math.max(dailyAverage, agentConfig.minimumBalance / 4);
  }, [transactionHistory, agentConfig.minimumBalance]);
  
  // Check gas price on the source chain
  const checkGasPrice = useCallback(async () => {
    try {
      const gasData = await getChainGasPrice(CHAIN_IDS[agentConfig.sourceChain]);
      if (gasData.success) {
        setCurrentGasPrice(gasData.formattedGasPrice);
        return parseFloat(gasData.formattedGasPrice);
      }
      return Infinity;
    } catch (error) {
      addLog('error', 'Failed to check gas price', { error });
      return Infinity;
    }
  }, [agentConfig.sourceChain, addLog]);
  
  // Execute a top-up
  const executeTopUp = useCallback(async (amount: number) => {
    if (!address) return false;
    
    try {
      setIsPending(true);
      addLog('top-up', `Initiating top-up of ${amount} USDC`, { amount });
      
      // Get quote for transfer
      const quote = await getTransferQuote(
        agentConfig.sourceChain,
        amount.toString(),
        address,
        address,
        agentConfig.cctpTransferType,
        agentConfig.useCCTPHooks
      );
      
      if (!quote.success) {
        addLog('error', 'Failed to get transfer quote', { error: quote.error });
        return false;
      }
      
      // Execute transfer
      const result = await executeTransfer(
        quote.quote,
        { address: address as `0x${string}` }
      );
      
      if (result.success) {
        addLog('top-up', `Successfully topped up ${amount} USDC`, { 
          txHash: result.transactionId,
          status: result.status
        });
        
        // Generate explanation with Gemini
        const explanation = await analyzePrompt(`
          Explain the following action in plain language:
          
          I detected that your MetaMask Card USDC balance was running low (${lineaBalance?.formatted || '0'} USDC).
          Based on your spending patterns, I predicted you would need approximately ${predictedSpend.toFixed(2)} USDC in the next day.
          
          I found a good gas price (${currentGasPrice} Gwei) and transferred ${amount} USDC from your ${agentConfig.sourceChain} wallet to your Linea wallet.
          
          This ensures your MetaMask Card remains funded for your daily needs.
        `);
        
        addLog('top-up', explanation, { amount, explanation });
        setLastTopUp(Date.now());
        return true;
      } else {
        addLog('error', 'Failed to execute transfer', { error: result.error });
        return false;
      }
    } catch (error) {
      addLog('error', 'Error during top-up process', { error });
      return false;
    } finally {
      setIsPending(false);
    }
  }, [
    address, 
    agentConfig.sourceChain, 
    agentConfig.cctpTransferType,
    agentConfig.useCCTPHooks,
    addLog, 
    analyzePrompt, 
    currentGasPrice, 
    lineaBalance, 
    predictedSpend
  ]);
  
  // Main check function
  const checkBalanceAndGas = useCallback(async () => {
    if (!address || !agentConfig.enabled || isPending) {
      return;
    }
    
    try {
      // Update predicted spend
      const dailyPrediction = predictDailySpend();
      setPredictedSpend(dailyPrediction);
      
      // Get current balance
      const currentBalance = parseFloat(lineaBalance?.formatted || '0');
      
      // Check if balance is below threshold
      const needsTopUp = currentBalance < (dailyPrediction + agentConfig.buffer);
      
      if (needsTopUp) {
        addLog('check', `Balance (${currentBalance} USDC) below threshold, checking gas price`, {
          currentBalance,
          predictedSpend: dailyPrediction,
          threshold: dailyPrediction + agentConfig.buffer
        });
        
        // Check gas price
        const gasPrice = await checkGasPrice();
        
        if (gasPrice < agentConfig.lowGasThreshold) {
          // Calculate top-up amount (2 days of predicted spend plus buffer)
          const topUpAmount = Math.ceil(dailyPrediction * 2 + agentConfig.buffer);
          
          // Make sure source chain has enough balance
          const sourceBalance = parseFloat(sourceChainBalance?.formatted || '0');
          if (sourceBalance < topUpAmount) {
            addLog('error', `Insufficient balance on source chain: ${sourceBalance} USDC`, {
              sourceBalance,
              requiredAmount: topUpAmount
            });
            return;
          }
          
          // Execute top-up
          await executeTopUp(topUpAmount);
        } else {
          addLog('check', `Gas price too high (${gasPrice} Gwei), waiting for better conditions`, {
            currentGasPrice: gasPrice,
            threshold: agentConfig.lowGasThreshold
          });
        }
      } else {
        addLog('check', `Balance (${currentBalance} USDC) sufficient, no action needed`, {
          currentBalance,
          predictedSpend: dailyPrediction,
          threshold: dailyPrediction + agentConfig.buffer
        });
      }
    } catch (error) {
      addLog('error', 'Error during balance and gas check', { error });
    } finally {
      // Schedule next check
      const nextCheck = Date.now() + agentConfig.checkInterval;
      setNextCheckTime(nextCheck);
    }
  }, [
    address,
    agentConfig.buffer,
    agentConfig.checkInterval,
    agentConfig.enabled,
    agentConfig.lowGasThreshold,
    addLog,
    checkGasPrice,
    executeTopUp,
    isPending,
    lineaBalance,
    predictDailySpend,
    sourceChainBalance
  ]);
  
  // Record a transaction
  const recordTransaction = useCallback((amount: number) => {
    setTransactionHistory(prev => [
      ...prev,
      { amount, timestamp: Date.now() }
    ].slice(-100)); // Keep last 100 transactions
  }, []);
  
  // Start/stop the agent
  const startAgent = useCallback(() => {
    if (!isRunning && address && isCircleInitialized) {
      setIsRunning(true);
      checkBalanceAndGas();
    }
  }, [isRunning, address, isCircleInitialized, checkBalanceAndGas]);
  
  const stopAgent = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  // Set up interval for periodic checks
  useEffect(() => {
    if (!isRunning || !address) return;
    
    const intervalId = setInterval(() => {
      checkBalanceAndGas();
    }, agentConfig.checkInterval);
    
    return () => clearInterval(intervalId);
  }, [isRunning, address, agentConfig.checkInterval, checkBalanceAndGas]);
  
  // Run initial check when agent is started
  useEffect(() => {
    if (isRunning && address && isCircleInitialized) {
      checkBalanceAndGas();
    }
  }, [isRunning, address, isCircleInitialized, checkBalanceAndGas]);
  
  // For backward compatibility
  const useFastCCTP = agentConfig.cctpTransferType === CCTPTransferType.FAST;
  
  return {
    isRunning,
    isPending,
    startAgent,
    stopAgent,
    predictedSpend,
    currentGasPrice,
    actionLog,
    lastTopUp,
    nextCheckTime,
    recordTransaction,
    executeTopUp,
    config: {
      ...agentConfig,
      useFastCCTP // For backward compatibility
    }
  };
}