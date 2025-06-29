import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// Initialize the Gemini API with the provided API key
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const ai = new GoogleGenerativeAI(geminiApiKey);

// Create an LRU cache to store responses
const responseCache = new LRUCache<string, string>({
  max: 100, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // Time to live: 1 hour
});

// Create a model selection function based on task complexity and type
const getModelForTask = (task: string, complexity: 'low' | 'medium' | 'high' = 'medium') => {
  // Task-specific model selection
  switch (task) {
    case 'spending_analysis':
      return complexity === 'high' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    case 'transaction_categorization':
      return 'gemini-1.5-flash'; // Simpler task, use flash model
    case 'sustainability_analysis':
      return 'gemini-1.5-pro'; // More complex analysis
    default:
      // Default model selection based on complexity
      switch (complexity) {
        case 'high':
          return 'gemini-1.5-pro'; // Most capable but higher rate limit impact
        case 'medium':
        case 'low':
        default:
          return 'gemini-1.5-flash'; // Good balance of capability and rate limits
      }
  }
};

// Implement fallback mechanism for rate limits
const generateWithFallback = async (prompt: string, task: string, complexity: 'low' | 'medium' | 'high' = 'medium') => {
  // Generate a cache key based on prompt
  const cacheKey = `${task}-${prompt.substring(0, 100)}`;
  
  // Check if we have a cached response
  const cachedResponse = responseCache.get(cacheKey);
  if (cachedResponse) {
    console.log('Using cached response');
    return cachedResponse;
  }
  
  // Define models to try in sequence
  const models = [
    getModelForTask(task, complexity),
    'gemini-1.5-flash',
  ];
  
  let lastError = null;
  
  // Try each model in sequence if previous one fails
  for (const modelName of models) {
    try {
      console.log(`Trying model ${modelName}`);
      const model = ai.getGenerativeModel({ model: modelName });
      
      const generationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      };
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });
      
      const response = result.response.text();
      
      // Cache the successful response
      responseCache.set(cacheKey, response);
      
      return response;
    } catch (error) {
      console.warn(`Error with model ${modelName}:`, error);
      lastError = error;
      // Continue to next model
    }
  }
  
  // If all models fail, throw the last error
  throw lastError || new Error('All models failed to generate content');
};

// Define request body type
interface RequestBody {
  prompt: string;
  modelComplexity?: 'low' | 'medium' | 'high';
  task?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await request.json();
    const { prompt, modelComplexity = 'medium', task = 'general' } = body;
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // Generate content with fallback mechanism
    const result = await generateWithFallback(prompt, task, modelComplexity);
    
    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    
    // Return a more detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number }).status || 500;
    
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: errorMessage,
        status: errorStatus
      }, 
      { status: errorStatus }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "Gemini API endpoint is ready" });
} 