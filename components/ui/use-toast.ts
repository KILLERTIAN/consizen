// Export toast from sonner directly
import { toast } from 'sonner';

// Re-export toast for backward compatibility
export { toast };

// Create a useToast hook for backward compatibility with existing code
export const useToast = () => {
  return {
    toast
  };
}; 