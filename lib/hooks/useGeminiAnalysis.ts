"use client";

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseGeminiAnalysisProps {
  transactions: Transaction[];
  walletAddress?: string | null;
  useMockData?: boolean;
}

interface UseGeminiAnalysisReturn {
  analyzeTransactions: () => Promise<void>;
  isAnalyzing: boolean;
  result: GeminiAnalysisResult | null;
  error: string | null;
}

// Types
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant?: string;
  category?: string;
  description?: string;
}

export interface SustainabilityAnalysis {
  score: number;
  carbonFootprint: number;
  recommendations: string[];
  merchantSustainabilityScore?: number;
  alternativeMerchants?: string[];
  offsetCost: number;
}

// Mock data for development when API rate limits are hit
const MOCK_DATA = {
  predictedSpend: 125.75,
  recommendedTopUp: 150,
  riskLevel: 'medium',
  insights: [
    'Your spending shows a consistent pattern with occasional spikes',
    'Weekly average spend is around $125',
    'Consider setting up automatic top-ups to avoid low balances'
  ]
};

interface GeminiAnalysisResult {
  predictedSpend: number;
  recommendedTopUp: number;
  riskLevel: string;
  insights: string[];
}

/**
 * Custom hook for analyzing transactions or merchants using the Gemini API
 * @param props Optional properties to configure the analysis
 */
export const useGeminiAnalysis = ({
  transactions,
  walletAddress,
  useMockData = false
}: UseGeminiAnalysisProps): UseGeminiAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<GeminiAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to analyze transactions using Gemini API
  const analyzeTransactions = useCallback(async () => {
    if (!transactions.length || !walletAddress) {
      setError('No transactions or wallet address available');
      return;
    }

    if (useMockData) {
      // Use mock data for development
      setIsAnalyzing(true);
      setTimeout(() => {
        setResult(MOCK_DATA);
        setIsAnalyzing(false);
      }, 2000); // Simulate API delay
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Format transaction data for the API
      const transactionData = transactions.map(tx => ({
        date: new Date(tx.date).toISOString(),
        amount: tx.amount,
        category: tx.category || 'uncategorized',
        merchant: tx.merchant || 'unknown'
      }));

      // First try with the flash model (faster, lower rate limit impact)
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze these transactions for wallet ${walletAddress} and provide:
            1. Predicted weekly spend (in USD)
            2. Recommended top-up amount (in USD)
            3. Risk level (low, medium, high)
            4. 2-3 key insights about spending patterns
            
            Format response as JSON with keys: predictedSpend, recommendedTopUp, riskLevel, insights (array)
            
            Transaction data: ${JSON.stringify(transactionData)}`,
          modelComplexity: 'medium', // Use medium complexity for this task
          task: 'spending_analysis'
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the response - handle both string and object formats
      let parsedResult: GeminiAnalysisResult;
      if (typeof data.result === 'string') {
        try {
          parsedResult = JSON.parse(data.result);
        } catch {
          // If parsing fails, try to extract the data using regex
          const predictedSpend = parseFloat(data.result.match(/predictedSpend["\s:]+(\d+\.?\d*)/)?.[1] || '0');
          const recommendedTopUp = parseFloat(data.result.match(/recommendedTopUp["\s:]+(\d+\.?\d*)/)?.[1] || '0');
          const riskLevel = data.result.match(/riskLevel["\s:]+["'](\w+)["']/)?.[1] || 'medium';
          const insightsMatch = data.result.match(/insights["\s:]+\[(.*?)\]/);
          const insights = insightsMatch ? 
            insightsMatch[1].split(',').map((s: string) => s.replace(/["']/g, '').trim()) : 
            ['No specific insights available'];
          
          parsedResult = {
            predictedSpend,
            recommendedTopUp,
            riskLevel,
            insights
          };
        }
      } else {
        parsedResult = data.result;
      }
      
      setResult(parsedResult);
    } catch (err) {
      console.error('Error analyzing transactions:', err);
      setError('Failed to analyze transactions. Using backup data.');
      // Fallback to mock data when API fails
      setResult(MOCK_DATA);
      toast.error('Analysis API rate limit reached. Using cached data instead.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [transactions, walletAddress, useMockData]);

  return {
    analyzeTransactions,
    isAnalyzing,
    result,
    error
  };
};

export default useGeminiAnalysis; 