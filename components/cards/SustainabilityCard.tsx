"use client";

import { motion } from "framer-motion";
import { CircleCheck, BarChart, Leaf, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface SustainabilityCardProps {
  title: string;
  score: number;
  carbonFootprint: number;
  carbonOffset: number;
  recommendation?: string;
  animation?: boolean;
  className?: string;
}

const SustainabilityCard = ({
  title,
  score,
  carbonFootprint,
  carbonOffset,
  recommendation,
  animation = true,
  className = "",
}: SustainabilityCardProps) => {
  const [showScore, setShowScore] = useState(animation ? 0 : score);
  
  // Animate score on mount
  useEffect(() => {
    if (!animation) return;
    
    const timeout = setTimeout(() => {
      setShowScore(score);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [score, animation]);
  
  // Get appropriate color and icon based on score
  const getScoreDetails = (score: number) => {
    if (score >= 80) {
      return { 
        text: "Excellent", 
        icon: CircleCheck,
        bgClass: "from-green-400 to-green-600" 
      };
    } else if (score >= 60) {
      return { 
        text: "Good", 
        icon: TrendingUp,
        bgClass: "from-yellow-400 to-yellow-600" 
      };
    } else if (score >= 40) {
      return { 
        text: "Moderate", 
        icon: BarChart,
        bgClass: "from-orange-400 to-orange-600" 
      };
    } else {
      return { 
        text: "Poor", 
        icon: AlertCircle,
        bgClass: "from-red-400 to-red-600" 
      };
    }
  };
  
  const { text, icon: Icon, bgClass } = getScoreDetails(score);
  
  // Calculate net carbon impact
  const netCarbonImpact = carbonFootprint - carbonOffset;
  
  return (
    <motion.div
      initial={animation ? { opacity: 0, y: 20 } : false}
      animate={animation ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
            <Badge 
              className={`bg-gradient-to-r ${bgClass} text-white`}
            >
              <Icon className="h-3 w-3 mr-1" />
              {text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-4">
            {/* Sustainability Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-gray-600 flex items-center">
                  <Leaf className="h-3.5 w-3.5 mr-1 text-green-600" />
                  Sustainability Score
                </div>
                <motion.div 
                  className="text-lg font-bold text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {showScore}/100
                </motion.div>
              </div>
              <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${bgClass} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${showScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            {/* Carbon Impact */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="rounded-lg p-2 bg-white/5">
                <div className="text-xs text-gray-600">Carbon Footprint</div>
                <div className="text-sm font-semibold text-gray-900">{carbonFootprint} kg CO₂</div>
              </div>
              <div className="rounded-lg p-2 bg-white/5">
                <div className="text-xs text-gray-600">Carbon Offset</div>
                <div className="text-sm font-semibold text-gray-900">{carbonOffset} kg CO₂</div>
              </div>
            </div>
            
            {/* Net Impact */}
            <div className="mt-1">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-gray-600">Net Carbon Impact</div>
                <div className={`text-sm font-semibold ${netCarbonImpact <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {netCarbonImpact <= 0 ? `${Math.abs(netCarbonImpact)} kg CO₂ saved` : `${netCarbonImpact} kg CO₂ emitted`}
                </div>
              </div>
              <Progress value={Math.max(0, 100 - (netCarbonImpact / carbonFootprint * 100))} className="h-1" />
            </div>
            
            {/* Recommendation */}
            {recommendation && (
              <div className="mt-2 p-2 rounded-lg bg-white/5 text-sm">
                <div className="text-xs font-medium mb-1 text-gray-800">Recommendation:</div>
                <div className="text-xs text-gray-700">{recommendation}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SustainabilityCard; 