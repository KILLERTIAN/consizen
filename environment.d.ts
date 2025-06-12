declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_GEMINI_API_KEY?: string;
    }
  }

  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (eventName: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: unknown[]) => void) => void;
    };
  }
} 