import { useState } from "react";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  category?: string;
  description?: string;
  network?: string;
  tokenAddress?: string;
  txHash?: string;
}

interface TransactionAnalysis {
  id: string;
  merchantName: string;
  score: number;
  carbonFootprint: number;
  offsetCost: number;
  recommendations: string[];
  network?: string;
  tokenAddress?: string;
  txHash?: string;
}

interface TotalImpact {
  totalScore: number;
  totalCarbonFootprint: number;
  totalOffsetCost: number;
}

export function useSustainabilityAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze a single transaction
  const analyzeTransaction = async (transaction: Transaction): Promise<TransactionAnalysis> => {
    // Mock implementation with network awareness
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Adjust scoring based on network and token type
    const baseScore = Math.floor(Math.random() * 40) + 40;
    const networkBonus = transaction.network === "sepolia" ? 10 : 0; // Bonus for using testnet
    const score = Math.min(baseScore + networkBonus, 100);
    
    const carbonFootprint = transaction.amount * 0.1;
    const offsetCost = carbonFootprint * 0.03;
    
    const recommendations = [
      transaction.network === "sepolia" 
        ? "Using testnet for testing shows responsible development practices."
        : "Consider using test networks for development.",
      "Reduce carbon footprint by combining transactions.",
      "Participate in sustainability challenges for rewards."
    ];

    return {
      id: transaction.id,
      merchantName: transaction.merchant,
      score,
      carbonFootprint,
      offsetCost,
      recommendations,
      network: transaction.network,
      tokenAddress: transaction.tokenAddress,
      txHash: transaction.txHash
    };
  };

  // Analyze a batch of transactions
  const analyzeTransactionBatch = async (transactions: Transaction[]): Promise<TransactionAnalysis[]> => {
    setIsAnalyzing(true);
    try {
      const results = await Promise.all(
        transactions.map(transaction => analyzeTransaction(transaction))
      );
      return results;
    } catch (error) {
      console.error("Error analyzing transactions:", error);
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate total impact from analyses
  const calculateTotalImpact = (analyses: TransactionAnalysis[]): TotalImpact => {
    if (analyses.length === 0) {
      return {
        totalScore: 0,
        totalCarbonFootprint: 0,
        totalOffsetCost: 0
      };
    }

    const totalScore = analyses.reduce((sum, analysis) => sum + analysis.score, 0) / analyses.length;
    const totalCarbonFootprint = analyses.reduce((sum, analysis) => sum + analysis.carbonFootprint, 0);
    const totalOffsetCost = analyses.reduce((sum, analysis) => sum + analysis.offsetCost, 0);

    return {
      totalScore,
      totalCarbonFootprint,
      totalOffsetCost
    };
  };

  return {
    analyzeTransaction,
    analyzeTransactionBatch,
    calculateTotalImpact,
    isAnalyzing
  };
}
