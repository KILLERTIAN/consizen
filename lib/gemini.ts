import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface MerchantData {
  name: string;
  category: string;
  description?: string;
  location?: string;
  certifications?: string[];
}

export interface SustainabilityScore {
  score: number; // 1-100
  reasoning: string;
  category: "eco-friendly" | "neutral" | "harmful";
  recommendations: string[];
  carbonIntensity: "low" | "medium" | "high";
}

export interface CarbonFootprint {
  co2Kg: number;
  category: string;
  offsetCost: number;
  impact: "low" | "medium" | "high";
}

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  sustainabilityScore?: number;
}

export interface SpendingPattern {
  sustainabilityTrend: "improving" | "declining" | "stable";
  topCategories: string[];
  ecoScore: number;
  suggestions: string[];
  impact: string;
}

export class ConsizeNAI {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  /**
   * Analyze merchant sustainability
   */
  async analyzeMerchant(merchant: MerchantData): Promise<SustainabilityScore> {
    const prompt = `
      Analyze the sustainability of this merchant and provide a detailed assessment:
      
      Merchant: ${merchant.name}
      Category: ${merchant.category}
      Description: ${merchant.description || "Not provided"}
      Location: ${merchant.location || "Not provided"}
      Certifications: ${merchant.certifications?.join(", ") || "None"}
      
      Please provide a JSON response with the following structure:
      {
        "score": number (1-100),
        "reasoning": "detailed explanation",
        "category": "eco-friendly" | "neutral" | "harmful",
        "recommendations": ["array of improvement suggestions"],
        "carbonIntensity": "low" | "medium" | "high"
      }
      
      Consider factors like:
      - Environmental impact
      - Social responsibility
      - Sustainable practices
      - Carbon footprint
      - Certifications and standards
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as SustainabilityScore;
      }
      
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error analyzing merchant:", error);
      return {
        score: 50,
        reasoning: "Unable to analyze merchant at this time",
        category: "neutral",
        recommendations: ["Consider researching the merchant's sustainability practices"],
        carbonIntensity: "medium"
      };
    }
  }

  /**
   * Calculate carbon footprint for a transaction
   */
  async calculateCarbonFootprint(
    amount: number,
    merchant: MerchantData,
    category: string
  ): Promise<CarbonFootprint> {
    const prompt = `
      Calculate the carbon footprint for this transaction:
      
      Amount: $${amount}
      Merchant: ${merchant.name}
      Category: ${category}
      
      Please provide a JSON response with the following structure:
      {
        "co2Kg": number (estimated CO2 in kg),
        "category": "transaction category",
        "offsetCost": number (cost to offset in USD),
        "impact": "low" | "medium" | "high"
      }
      
      Consider:
      - Transaction amount
      - Merchant type and practices
      - Industry averages
      - Environmental impact factors
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as CarbonFootprint;
      }
      
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error calculating carbon footprint:", error);
      return {
        co2Kg: amount * 0.001, // Default calculation
        category: category,
        offsetCost: amount * 0.01, // 1% of transaction
        impact: "low"
      };
    }
  }

  /**
   * Get sustainability recommendations
   */
  async getRecommendations(
    userPreferences: string[],
    spendingHistory: Transaction[]
  ): Promise<string[]> {
    const prompt = `
      Based on the user's preferences and spending history, provide sustainability recommendations:
      
      User Preferences: ${userPreferences.join(", ")}
      Spending History: ${JSON.stringify(spendingHistory.slice(-5))}
      
      Provide 5 actionable recommendations as a JSON array of strings.
      Focus on:
      - Eco-friendly alternatives
      - Sustainable spending habits
      - Carbon reduction strategies
      - Community impact opportunities
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as string[];
      }
      
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [
        "Consider shopping at local farmers markets",
        "Look for products with eco-certifications",
        "Use public transportation when possible",
        "Support businesses with sustainable practices",
        "Join community sustainability challenges"
      ];
    }
  }

  /**
   * Generate community challenge ideas
   */
  async generateChallenges(): Promise<string[]> {
    const prompt = `
      Generate 5 creative sustainability challenges for a community of conscious consumers:
      
      Challenges should be:
      - Achievable within a month
      - Measurable and trackable
      - Engaging and fun
      - Focused on spending habits
      - Community-oriented
      
      Provide as a JSON array of challenge descriptions.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as string[];
      }
      
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error generating challenges:", error);
      return [
        "30-Day Local Business Challenge",
        "Zero-Waste Shopping Challenge",
        "Carbon-Neutral Week Challenge",
        "Sustainable Food Challenge",
        "Green Transportation Challenge"
      ];
    }
  }

  /**
   * Analyze spending patterns for sustainability insights
   */
  async analyzeSpendingPatterns(transactions: Transaction[]): Promise<SpendingPattern> {
    const prompt = `
      Analyze these spending patterns for sustainability insights:
      
      Transactions: ${JSON.stringify(transactions.slice(-10))}
      
      Provide a JSON response with:
      {
        "sustainabilityTrend": "improving" | "declining" | "stable",
        "topCategories": ["array of spending categories"],
        "ecoScore": number (1-100),
        "suggestions": ["array of improvement suggestions"],
        "impact": "summary of environmental impact"
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as SpendingPattern;
      }
      
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error analyzing spending patterns:", error);
      return {
        sustainabilityTrend: "stable",
        topCategories: ["general"],
        ecoScore: 50,
        suggestions: ["Start tracking your sustainability impact"],
        impact: "Moderate environmental impact"
      };
    }
  }
}

// Export singleton instance
export const consizeNAI = new ConsizeNAI(); 