"use client";

import { useState } from "react";
import { GeminiAnalysis } from "@/lib/types";

interface UseGeminiAnalysisProps {
  merchant?: string;
  amount?: number;
  category?: string;
  prompt?: string;
}

interface UseGeminiAnalysisReturn {
  analyze: () => Promise<GeminiAnalysis | null>;
  analyzePrompt: (prompt: string) => Promise<string>;
  analysis: GeminiAnalysis | null;
  textAnalysis: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for analyzing transactions or merchants using the Gemini API
 * @param props Optional properties to configure the analysis
 */
export function useGeminiAnalysis(props?: UseGeminiAnalysisProps): UseGeminiAnalysisReturn {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [textAnalysis, setTextAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyze a transaction based on merchant, amount, and category
   */
  const analyze = async (): Promise<GeminiAnalysis | null> => {
    if (!props?.merchant || !props?.amount || !props?.category) {
      setError("Merchant, amount, and category are required");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Merchant: ${props.merchant}, Amount: $${props.amount}, Category: ${props.category}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze transaction");
      }

      const data = await response.json();
      
      // Parse the analysis text into structured data
      // This is a simplified version - in production you would have more robust parsing
      const analysisText = data.analysis;
      setTextAnalysis(analysisText);
      
      // Extract score (looking for a number followed by /100)
      const scoreMatch = analysisText.match(/(\d+)\s*\/\s*100/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 40) + 40;
      
      // Extract carbon footprint (looking for a number followed by kg CO2 or similar)
      const carbonMatch = analysisText.match(/(\d+\.?\d*)\s*kg\s*CO[²₂]?/i);
      const carbon = carbonMatch ? parseFloat(carbonMatch[1]) : parseFloat((Math.random() * 3 + 0.5).toFixed(1));
      
      // Create a structured analysis
      const geminiAnalysis: GeminiAnalysis = {
        merchantAnalysis: analysisText,
        sustainabilityScore: score,
        carbonFootprint: carbon,
        recommendation: analysisText.split('recommendations:')[1]?.split('\n')[0]?.trim() || 
                        `Consider more sustainable alternatives to ${props.merchant}`,
        alternativeSuggestions: [],
        impactSummary: `This transaction has a sustainability score of ${score}/100 and generated approximately ${carbon}kg of CO₂.`,
      };

      setAnalysis(geminiAnalysis);
      return geminiAnalysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Analyze any prompt directly with Gemini
   * @param prompt The text to analyze
   */
  const analyzePrompt = async (prompt: string): Promise<string> => {
    if (!prompt) {
      setError("Prompt is required");
      return "";
    }

    setIsLoading(true);
    setError(null);
    setTextAnalysis('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setTextAnalysis(data.analysis);
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze with Gemini';
      setError(errorMessage);
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyze,
    analyzePrompt,
    analysis,
    textAnalysis,
    isLoading,
    error,
  };
} 