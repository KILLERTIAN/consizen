"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  BrainCircuit, 
  AlertCircle,
  Loader2,
  Wallet,
  LineChart,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AutoTopAgentProps {
  isWalletConnected: boolean;
  walletAddress?: string | null;
  onTopUp?: (amount: number) => Promise<void>;
  network?: "sepolia" | "lineaSepolia";
}

// Mock spending data for demonstration
interface SpendingPattern {
  day: string;
  amount: number;
}

export function AutoTopAgent({ 
  isWalletConnected,
  walletAddress,
  onTopUp,
  network = "sepolia"
}: AutoTopAgentProps) {
  const [amount, setAmount] = useState("50");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "AI Agent initialized...",
    "Monitoring wallet balance...",
  ]);
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern[]>([]);
  const [predictedSpend, setPredictedSpend] = useState<number | null>(null);
  const [recommendedAmount, setRecommendedAmount] = useState<number | null>(null);
  const [currentBalance, setCurrentBalance] = useState<string>("0.00");
  
  // Network-specific styling
  const networkColor = network === "sepolia" ? "orange" : "green";
  const gradientFrom = network === "sepolia" ? "from-orange-50" : "from-green-50";
  const gradientTo = network === "sepolia" ? "to-orange-100/50" : "to-green-100/50";
  const borderColor = network === "sepolia" ? "border-orange-200" : "border-green-200";
  const textColor = network === "sepolia" ? "text-orange-800" : "text-green-800";
  const buttonGradientFrom = network === "sepolia" ? "from-orange-400" : "from-green-400";
  const buttonGradientTo = network === "sepolia" ? "to-orange-500" : "to-green-500";
  const buttonHoverFrom = network === "sepolia" ? "hover:from-orange-500" : "hover:from-green-500";
  const buttonHoverTo = network === "sepolia" ? "hover:to-orange-600" : "hover:to-green-600";
  
  // Add log message
  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);
  
  // Execute recommended top-up
  const handleRecommendedTopUp = useCallback(async () => {
    if (!recommendedAmount || !onTopUp) return;
    
    try {
      setIsLoading(true);
      addLog(`Initiating recommended top-up of ${recommendedAmount} USDC...`);
      
      await onTopUp(recommendedAmount);
      
      addLog(`Successfully topped up ${recommendedAmount} USDC`);
      toast.success(`Successfully topped up ${recommendedAmount} USDC`);
      
      // Update the balance after top-up (mock for demo)
      const newBalance = (parseFloat(currentBalance) + recommendedAmount).toFixed(2);
      setCurrentBalance(newBalance);
    } catch (error) {
      console.error("Error executing recommended top-up:", error);
      addLog("Error executing recommended top-up. Please try again.");
      toast.error("Error executing recommended top-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [recommendedAmount, onTopUp, addLog, currentBalance]);
  
  // Handle manual top-up
  const handleTopUp = async () => {
    if (!onTopUp) return;
    
    try {
      setIsLoading(true);
      addLog("Initiating top-up...");
      
      await onTopUp(parseFloat(amount));
      
      addLog(`Successfully topped up ${amount} USDC`);
      toast.success(`Successfully topped up ${amount} USDC`);
      
      // Update the balance after top-up (mock for demo)
      const newBalance = (parseFloat(currentBalance) + parseFloat(amount)).toFixed(2);
      setCurrentBalance(newBalance);
    } catch (error) {
      console.error("Error topping up:", error);
      addLog("Error topping up. Please try again.");
      toast.error("Error topping up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze spending patterns
  const analyzeSendingPatterns = useCallback(async () => {
    if (!isWalletConnected || !walletAddress) return;
    
    setIsAnalyzing(true);
    addLog("Analyzing spending patterns...");
    
    try {
      // Mock data generation - in a real app, this would call an API
      const mockSpendingData = [
        { day: "Mon", amount: 15.50 },
        { day: "Tue", amount: 22.75 },
        { day: "Wed", amount: 18.20 },
        { day: "Thu", amount: 35.40 },
        { day: "Fri", amount: 42.30 },
        { day: "Sat", amount: 28.90 },
        { day: "Sun", amount: 12.60 }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSpendingPatterns(mockSpendingData);
      
      // Calculate predicted spend and recommended amount
      const totalSpend = mockSpendingData.reduce((sum, day) => sum + day.amount, 0);
      const avgDailySpend = totalSpend / 7;
      const weeklyPrediction = avgDailySpend * 7;
      const recommended = Math.ceil(weeklyPrediction * 1.2); // 20% buffer
      
      setPredictedSpend(weeklyPrediction);
      setRecommendedAmount(recommended);
      
      addLog(`Analysis complete. Predicted weekly spend: $${weeklyPrediction.toFixed(2)}`);
      addLog(`Recommended top-up amount: $${recommended.toFixed(2)}`);
      
      // If auto top-up is enabled, suggest a top-up
      if (isEnabled && parseFloat(currentBalance) < avgDailySpend * 3) {
        addLog("Balance below threshold. Recommending top-up.");
        toast.info("Low balance detected", {
          description: "Your balance is below the recommended threshold. Consider a top-up.",
          action: {
            label: "Top Up",
            onClick: () => handleRecommendedTopUp()
          }
        });
      }
    } catch (error) {
      console.error("Error analyzing spending patterns:", error);
      addLog("Error analyzing spending patterns. Using cached data.");
      toast.error("Analysis failed. Using cached data.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [isWalletConnected, walletAddress, isEnabled, currentBalance, addLog, handleRecommendedTopUp]);
  
  // Get current balance
  useEffect(() => {
    const getBalance = async () => {
      if (!isWalletConnected || !walletAddress) return;
      
      try {
        // In a real app, this would fetch the actual USDC balance
        // For demo purposes, we'll use a mock balance
        setCurrentBalance("75.25");
        addLog("Updated wallet balance: 75.25 USDC");
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    
    getBalance();
  }, [isWalletConnected, walletAddress, addLog]);
  
  // Run analysis when enabled changes
  useEffect(() => {
    if (isEnabled && isWalletConnected) {
      analyzeSendingPatterns();
      addLog("Auto top-up enabled. Monitoring spending patterns.");
      
      // Store the enabled state in localStorage to persist across page navigation
      localStorage.setItem('autoTopAgentEnabled', 'true');
    } else if (!isEnabled) {
      localStorage.setItem('autoTopAgentEnabled', 'false');
    }
  }, [isEnabled, isWalletConnected, analyzeSendingPatterns, addLog]);
  
  // Check localStorage on component mount to restore previous state
  useEffect(() => {
    const savedState = localStorage.getItem('autoTopAgentEnabled');
    if (savedState === 'true' && isWalletConnected) {
      setIsEnabled(true);
    }
  }, [isWalletConnected]);

  return (
    <Card className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} ${borderColor} shadow-sm`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className={`flex items-center gap-2 ${textColor}`}>
            <div className={`w-8 h-8 rounded-full bg-${networkColor}-500 flex items-center justify-center shadow-md`}>
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            AI Auto-Top Agent
          </CardTitle>
          <Badge 
            variant={isEnabled ? "default" : "outline"} 
            className={`px-2 py-1 text-xs ${
              isEnabled 
                ? network === "sepolia" 
                  ? "bg-orange-500" 
                  : "bg-green-500" 
                : "text-gray-500"
            }`}
          >
            {isEnabled ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription className="text-gray-600">
          AI-powered automatic wallet top-up
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isWalletConnected ? (
          <>
            <div className="flex items-center space-x-2 mb-4 p-3 bg-white/80 rounded-lg border border-gray-100 shadow-sm">
              <Switch 
                id="auto-top-up" 
                checked={isEnabled} 
                onCheckedChange={setIsEnabled} 
                disabled={!isWalletConnected}
                className={`data-[state=checked]:bg-${networkColor}-500 scale-125`}
              />
              <Label htmlFor="auto-top-up" className="font-medium text-gray-800">Enable AI Auto Top-up</Label>
            </div>
            
            {/* Current Balance */}
            <div className="bg-white/80 rounded-lg p-3 mb-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className={`h-4 w-4 text-${networkColor}-500`} />
                  <span className="text-sm text-gray-500">Current Balance:</span>
                </div>
                <div className="font-medium text-gray-900">{currentBalance} USDC</div>
              </div>
            </div>
            
            {/* Spending Analysis */}
            {isEnabled && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium flex items-center gap-1 text-gray-800">
                    <LineChart className="h-3.5 w-3.5 text-gray-600" />
                    Spending Analysis
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs px-2 text-gray-700 hover:text-gray-900"
                    onClick={analyzeSendingPatterns}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </Button>
                </div>
                
                {spendingPatterns.length > 0 ? (
                  <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {spendingPatterns.map((day) => (
                        <div key={day.day} className="flex flex-col items-center">
                          <div className="h-16 w-full flex items-end">
                            <div 
                              className={`w-full bg-${networkColor}-500/80 rounded-t`} 
                              style={{ height: `${(day.amount / 50) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-gray-700">{day.day}</div>
                        </div>
                      ))}
                    </div>
                    
                    {predictedSpend !== null && recommendedAmount !== null && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Weekly Prediction:</span>
                          <span className="font-medium text-gray-900">${predictedSpend.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Recommended Top-up:</span>
                          <span className="font-medium text-gray-900">${recommendedAmount.toFixed(2)}</span>
                        </div>
                        
                        <Button
                          className={`w-full mt-3 bg-${networkColor}-500 hover:bg-${networkColor}-600 text-white text-xs py-1 h-8`}
                          onClick={handleRecommendedTopUp}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Top Up $${recommendedAmount.toFixed(2)}`
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-gray-100 text-center py-4">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-6 w-6 animate-spin mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Analyzing spending patterns...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <LineChart className="h-6 w-6 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">No spending data available</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={analyzeSendingPatterns}
                          className="text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                          Analyze Spending
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Manual Top-up */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label htmlFor="amount" className="col-span-1 text-gray-700">Amount (USDC):</Label>
                <div className="col-span-2">
                  <Input 
                    id="amount" 
                    type="number" 
                    min={1} 
                    max={1000} 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className={`border-${networkColor}-200 text-gray-900`}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleTopUp} 
                disabled={isLoading || !isWalletConnected}
                className={`w-full bg-gradient-to-r ${buttonGradientFrom} ${buttonGradientTo} ${buttonHoverFrom} ${buttonHoverTo}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Manual Top-up
                  </>
                )}
              </Button>
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-2 flex items-center gap-1 text-gray-800">
                  <Clock className="h-3.5 w-3.5 text-gray-600" />
                  Agent Logs:
                </div>
                <ScrollArea className="h-24 w-full rounded border bg-black/5 p-2">
                  <div className="space-y-1">
                    {logs.map((log, i) => (
                      <div key={i} className="text-xs text-gray-700 font-mono">
                        <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="mx-auto h-8 w-8 mb-2 text-gray-500" />
            <p className="text-gray-600">Connect your wallet to use the AI Auto-Top Agent</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 