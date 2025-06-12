"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Coffee, ShoppingBag, Utensils, Car, Home, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from 'date-fns';
import { Transaction } from "@/lib/types";

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  className?: string;
}

const TransactionCard = ({
  transaction,
  onClick,
  className = "",
}: TransactionCardProps) => {
  // Get category icon based on the transaction category
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ElementType> = {
      "coffee": Coffee,
      "food": Utensils,
      "shopping": ShoppingBag,
      "transport": Car,
      "utilities": Home,
      "tech": Smartphone,
    };
    
    const Icon = iconMap[category.toLowerCase()] || ShoppingBag;
    return Icon;
  };
  
  // Get color based on sustainability score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    if (score >= 40) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  // Format transaction date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };
  
  const Icon = getCategoryIcon(transaction.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card 
        className="glass-card overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Icon Section */}
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-gray-600" />
            </div>
            
            {/* Content Section */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{transaction.merchant}</div>
                  <div className="text-xs text-gray-500">{formatDate(transaction.date)}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {transaction.currency} {transaction.amount.toFixed(2)}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`text-xs px-1.5 py-0.5 rounded-full inline-flex items-center ${getScoreColor(transaction.sustainabilityScore)}`}>
                          Score: {transaction.sustainabilityScore}/100
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div>Carbon footprint: {transaction.carbonFootprint} kg</div>
                          <div>Carbon offset: {transaction.carbonOffset} kg</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {/* If there's a recommendation, show it */}
              {transaction.recommendation && (
                <div className="mt-2 p-2 bg-sustainability-50 rounded-md text-xs text-sustainability-700">
                  <div className="font-medium mb-0.5">Eco Tip:</div>
                  <div>{transaction.recommendation}</div>
                </div>
              )}
              
              {/* Action Button */}
              <div className="mt-2 flex justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                  View Details
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionCard; 