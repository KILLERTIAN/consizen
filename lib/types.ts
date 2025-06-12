// Global types for the ConsizeN application

// Ethereum window type
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

// Sustainability score types
export type SustainabilityScore = {
  score: number;
  category: 'poor' | 'moderate' | 'good' | 'excellent';
  color: string;
};

/**
 * Transaction details for a MetaMask Card transaction
 */
export interface Transaction {
  /**
   * Unique transaction ID
   */
  id: string;
  
  /**
   * Name of the merchant
   */
  merchant: string;
  
  /**
   * Transaction amount in USD
   */
  amount: number;
  
  /**
   * Transaction currency
   */
  currency?: string;
  
  /**
   * Transaction date
   */
  date: Date | string;
  
  /**
   * Transaction category
   */
  category: string;
  
  /**
   * Estimated carbon footprint in kg CO2
   */
  carbonFootprint: number;
  
  /**
   * Carbon offset amount in kg CO2
   */
  carbonOffset?: number;
  
  /**
   * Sustainability score (0-100)
   */
  sustainabilityScore: number;
  
  /**
   * Optional sustainability analysis by Gemini AI
   */
  sustainabilityAnalysis?: GeminiAnalysis;
  
  /**
   * Recommendation for more sustainable alternatives
   */
  recommendation?: string;
  
  /**
   * Status of the transaction
   */
  status?: 'pending' | 'completed' | 'failed';
  
  /**
   * Whether carbon offsets have been purchased for this transaction
   */
  carbonOffsetPurchased?: boolean;
}

// User profile types
export type UserProfile = {
  address: string;
  totalTransactions: number;
  totalSpent: number;
  totalCarbonFootprint: number;
  totalCarbonOffset: number;
  averageSustainabilityScore: number;
  completedChallenges: number;
  activeChallenges: number;
  impactLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
};

// Sustainability challenge types
export type Challenge = {
  id: string;
  title: string;
  description: string;
  participants: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  reward: string;
  carbonSaved: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  userParticipating?: boolean;
};

// Merchant types
export type Merchant = {
  id: string;
  name: string;
  category: string;
  sustainabilityScore: number;
  sustainabilityRating: 'poor' | 'moderate' | 'good' | 'excellent';
  carbonFootprintPerDollar: number;
  sustainabilityInitiatives: string[];
  alternatives?: {
    name: string;
    sustainabilityScore: number;
    distance: number;
  }[];
};

/**
 * Carbon offset certificate
 */
export interface CarbonOffset {
  /**
   * Unique certificate ID
   */
  id: string;
  
  /**
   * Amount of carbon offset (kg CO2)
   */
  amount: number;
  
  /**
   * Date of purchase
   */
  purchaseDate: Date | string;
  
  /**
   * Cost of the offset in USD
   */
  cost: number;
  
  /**
   * Provider of the carbon offset
   */
  provider: string;
  
  /**
   * Project name or description
   */
  project?: string;
  
  /**
   * Detailed project description
   */
  projectDescription?: string;
  
  /**
   * Whether the offset is verified
   */
  verified?: boolean;
  
  /**
   * Certificate URL or ID
   */
  certificate?: string;
  
  /**
   * Type of offset project
   */
  projectType?: 'reforestation' | 'renewable energy' | 'methane capture' | 'other';
  
  /**
   * Location of the offset project
   */
  location?: string;
}

// Gemini AI analysis types
export interface GeminiAnalysis {
  /**
   * Overall analysis of the merchant's sustainability practices
   */
  merchantAnalysis: string;
  
  /**
   * Sustainability score from 0-100
   */
  sustainabilityScore: number;
  
  /**
   * Estimated carbon footprint in kg of CO2
   */
  carbonFootprint: number;
  
  /**
   * Recommendation for more sustainable alternatives
   */
  recommendation: string;
  
  /**
   * List of specific alternative sustainable options
   */
  alternativeSuggestions: string[];
  
  /**
   * Summary of the transaction's environmental impact
   */
  impactSummary: string;
}

// Chart data types
export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth?: number;
  }[];
};

// Dashboard stats types
export type DashboardStats = {
  totalSpent: number;
  totalTransactions: number;
  averageSustainabilityScore: number;
  totalCarbonFootprint: number;
  totalCarbonOffset: number;
  netCarbonImpact: number;
  sustainabilityTrend: 'up' | 'down' | 'stable';
  mostSustainableMerchant: string;
  leastSustainableMerchant: string;
};

/**
 * User's sustainability profile
 */
export interface SustainabilityProfile {
  /**
   * Overall sustainability score (0-100)
   */
  score: number;
  
  /**
   * Total carbon footprint (kg CO2)
   */
  carbonFootprint: number;
  
  /**
   * Total carbon offsets purchased (kg CO2)
   */
  carbonOffsets: number;
  
  /**
   * Net carbon impact (footprint - offsets)
   */
  netCarbonImpact: number;
  
  /**
   * Improvement compared to last month (percentage)
   */
  monthlyImprovement: number;
} 