import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini API with the provided API key
const geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBjMk6FwKS-gcbxasnBa2r9P5IfgjsLJCQ';
const ai = new GoogleGenerativeAI(geminiApiKey);

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Using Gemini 1.5 Pro model
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Configure the model for text response
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    // Construct the prompt with agentic thinking focus
    const fullPrompt = `
      As an AI sustainability agent for ConsizeN, analyze the following transaction or merchant data and provide:
      1. A sustainability score (0-100)
      2. Environmental impact assessment
      3. Specific recommendations for more eco-friendly alternatives
      4. Carbon offset suggestion
      
      Think step-by-step about how this merchant or transaction impacts the environment.
      
      Transaction/Merchant: ${prompt}
    `;

    // Generate response from Gemini
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: errorMessage || "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "Gemini API endpoint is ready" });
} 