"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Wallet, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  BarChart3,
  Leaf,
  TreePine,
  LineChart,
  Clock,
  Zap,
  CircleDollarSign
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSustainabilityAnalysis, Transaction } from "@/lib/hooks/useSustainabilityAnalysis";
import MetaMaskExtensionCheck from "@/components/utils/MetaMaskExtensionCheck";

// Dynamically import motion components with no SSR
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    date: "2023-06-15T10:23:00Z",
    amount: 25.00,
    merchant: "Starbucks",
    category: "restaurants",
    description: "Coffee and breakfast"
  },
  {
    id: "tx2",
    date: "2023-06-14T15:45:00Z",
    amount: 50.00,
    merchant: "Amazon",
    category: "shopping",
    description: "Electronics purchase"
  },
  {
    id: "tx3",
    date: "2023-06-12T09:15:00Z",
    amount: 15.00,
    merchant: "Uber",
    category: "transportation",
    description: "Ride to work"
  },
  {
    id: "tx4",
    date: "2023-06-10T18:30:00Z",
    amount: 75.00,
    merchant: "Whole Foods",
    category: "groceries",
    description: "Weekly grocery shopping"
  },
  {
    id: "tx5",
    date: "2023-06-08T12:45:00Z",
    amount: 30.00,
    merchant: "Netflix",
    category: "entertainment",
    description: "Monthly subscription"
  }
];

export default function MetaMaskWalletPage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [analyses, setAnalyses] = useState<any[]>([]);
  
  const { 
    analyzeTransactionBatch, 
    calculateTotalImpact, 
    analyzingBatch 
  } = useSustainabilityAnalysis();

  // Connect to MetaMask
  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        toast.error("MetaMask is not installed. Please install it to continue.");
        return;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        
        // Get wallet balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"]
        });
        
        // Convert from wei to ETH
        const ethBalance = parseInt(balance, 16) / 1e18;
        setWalletBalance(ethBalance.toFixed(4));
        
        toast.success("Connected to MetaMask successfully!");
        
        // Analyze transactions
        analyzeTransactions();
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast.error("Failed to connect to MetaMask. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze transactions
  const analyzeTransactions = async () => {
    if (mockTransactions.length === 0) return;
    
    try {
      const results = await analyzeTransactionBatch(mockTransactions);
      setAnalyses(results);
    } catch (error) {
      console.error("Error analyzing transactions:", error);
      toast.error("Failed to analyze transactions");
    }
  };

  // Calculate total impact
  const totalImpact = analyses.length > 0 ? calculateTotalImpact(analyses) : {
    totalScore: 0,
    totalCarbonFootprint: 0,
    totalOffsetCost: 0
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get sustainability badge color
  const getSustainabilityBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-blue-100 text-blue-700";
    if (score >= 40) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Get sustainability label
  const getSustainabilityLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 mt-16">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">MetaMask Wallet</h1>
        <p className="text-gray-600 mt-2">
          Manage your MetaMask wallet and track your sustainability impact
        </p>
      </MotionDiv>

      <MetaMaskExtensionCheck />

      {!isConnected ? (
        <Card className="glass-card card-glow border-white/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your MetaMask Wallet</CardTitle>
            <CardDescription>
              Connect your MetaMask wallet to view your balance, transactions, and sustainability impact
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button 
              onClick={connectWallet} 
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Image 
                    src="/metamask-logo.svg" 
                    alt="MetaMask" 
                    width={24} 
                    height={24} 
                    className="mr-2" 
                  />
                  Connect MetaMask
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Wallet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="glass-card card-glow border-white/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Wallet Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-mono text-sm truncate max-w-[200px]">
                      {walletAddress}
                    </div>
                    <div className="text-xs text-gray-500">Linea Network</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card card-glow border-white/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <CircleDollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{walletBalance} ETH</div>
                    <div className="text-xs text-gray-500">Linea Network</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card card-glow border-white/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Sustainability Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{Math.round(totalImpact.totalScore)}/100</div>
                    <div className="text-xs text-gray-500">
                      {getSustainabilityLabel(totalImpact.totalScore)} Impact
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 gap-4 bg-transparent">
              <TabsTrigger 
                value="transactions" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Clock className="mr-2 h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger 
                value="sustainability" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Leaf className="mr-2 h-4 w-4" />
                Sustainability
              </TabsTrigger>
              <TabsTrigger 
                value="impact" 
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="glass-card card-glow border-white/30">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
                  <CardDescription>
                    Your recent transactions with sustainability scores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {mockTransactions.map((tx, index) => (
                        <div key={tx.id} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{tx.merchant || "Unknown Merchant"}</p>
                                {analyses[index] && (
                                  <Badge className={getSustainabilityBadgeColor(analyses[index].score)}>
                                    Score: {analyses[index].score}/100
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(tx.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">${tx.amount.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">{tx.category}</p>
                            </div>
                          </div>
                          {analyses[index] && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Carbon: {analyses[index].carbonFootprint.toFixed(2)} kg CO</span>
                                <span>Offset Cost: ${analyses[index].offsetCost.toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No transactions found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sustainability" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card card-glow border-white/30">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Carbon Footprint</CardTitle>
                    <CardDescription>
                      Your carbon footprint from recent transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{totalImpact.totalCarbonFootprint.toFixed(2)} kg</p>
                        <p className="text-sm text-gray-500">Total CO emissions</p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <TreePine className="h-8 w-8 text-green-600" />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <p className="text-sm font-medium">Emissions by Category</p>
                      {Object.entries(
                        mockTransactions.reduce<Record<string, number>>((acc, tx, i) => {
                          const category = tx.category || "unknown";
                          if (!acc[category]) acc[category] = 0;
                          if (analyses[i]) acc[category] += analyses[i].carbonFootprint;
                          return acc;
                        }, {})
                      ).map(([category, footprint]) => (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{category}</span>
                            <span>{footprint.toFixed(2)} kg</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                              style={{ 
                                width: `${Math.min(100, (footprint / totalImpact.totalCarbonFootprint) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card card-glow border-white/30">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Offset Opportunities</CardTitle>
                    <CardDescription>
                      Ways to offset your carbon footprint
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">${totalImpact.totalOffsetCost.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Total offset cost</p>
                      </div>
                      <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        Offset Now
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <p className="text-sm font-medium">Offset Projects</p>
                      
                      {[
                        {
                          name: "Reforestation Project",
                          location: "Amazon Rainforest",
                          cost: totalImpact.totalOffsetCost * 0.8,
                          impact: "High"
                        },
                        {
                          name: "Renewable Energy",
                          location: "Solar Farm Initiative",
                          cost: totalImpact.totalOffsetCost * 1.2,
                          impact: "Medium"
                        },
                        {
                          name: "Ocean Cleanup",
                          location: "Pacific Ocean",
                          cost: totalImpact.totalOffsetCost * 1.5,
                          impact: "High"
                        }
                      ].map((project, i) => (
                        <div key={i} className="p-3 rounded-lg border border-gray-200 bg-white/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-xs text-gray-500">{project.location}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">${project.cost.toFixed(2)}</p>
                              <Badge className="bg-green-100 text-green-700">
                                {project.impact} Impact
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="glass-card card-glow border-white/30">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Sustainability Recommendations</CardTitle>
                  <CardDescription>
                    AI-powered recommendations to reduce your carbon footprint
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analyses.flatMap(analysis => 
                      analysis.recommendations.slice(0, 1).map((rec, i) => (
                        <div key={`${analysis.id}-${i}`} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                              <Zap className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{rec}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Potential savings: {(Math.random() * 5).toFixed(2)} kg CO
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card card-glow border-white/30">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Impact Dashboard</CardTitle>
                    <CardDescription>
                      Your environmental impact at a glance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-sm text-gray-600">Total Carbon</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {totalImpact.totalCarbonFootprint.toFixed(2)} kg
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                        <p className="text-sm text-gray-600">Trees Needed</p>
                        <p className="text-2xl font-bold text-green-700">
                          {Math.ceil(totalImpact.totalCarbonFootprint / 20)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                        <p className="text-sm text-gray-600">Offset Cost</p>
                        <p className="text-2xl font-bold text-purple-700">
                          ${totalImpact.totalOffsetCost.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                        <p className="text-sm text-gray-600">Avg. Score</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {Math.round(totalImpact.totalScore)}/100
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <p className="text-sm font-medium mb-4">Sustainability Progress</p>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                          style={{ width: `${totalImpact.totalScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Poor</span>
                        <span>Fair</span>
                        <span>Good</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card card-glow border-white/30">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Monthly Trends</CardTitle>
                    <CardDescription>
                      Your sustainability trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Carbon Reduction</p>
                        <p className="text-2xl font-bold text-green-600">-12%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Score Improvement</p>
                        <p className="text-2xl font-bold text-blue-600">+8%</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <p className="text-sm font-medium">Monthly Carbon Footprint</p>
                      <div className="h-40 flex items-end justify-between">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => (
                          <div key={month} className="flex flex-col items-center">
                            <div 
                              className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-md"
                              style={{ 
                                height: `${80 + Math.sin(i) * 40}px`,
                                opacity: i === 5 ? 1 : 0.7
                              }}
                            />
                            <p className="text-xs mt-2">{month}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Community Impact */}
              <Card className="glass-card card-glow border-white/30">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Community Impact</CardTitle>
                  <CardDescription>
                    How your sustainability efforts compare to the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg border border-gray-200 bg-white/50 text-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <TreePine className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-xl font-bold">Top 25%</p>
                      <p className="text-sm text-gray-600">Sustainability Rank</p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200 bg-white/50 text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <LineChart className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-xl font-bold">15% Better</p>
                      <p className="text-sm text-gray-600">Than Average</p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200 bg-white/50 text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <Leaf className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-xl font-bold">3 Trees</p>
                      <p className="text-sm text-gray-600">Saved This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
 
 