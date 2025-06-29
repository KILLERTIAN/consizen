"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ExternalLink, 
  Shield, 
  ArrowDownUp, 
  CircleDollarSign,
  Bell,
  LineChart,
  Receipt,
  Sparkles,
  Heart,
  Settings,
  CreditCard as CreditCardIcon,
  RefreshCw,
  Loader2,
  Zap,
  ArrowUpRight
} from "lucide-react";
import MainNav from "@/components/layout/MainNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import TransactionCard from "@/components/cards/TransactionCard";
import { Transaction } from "@/lib/types";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import { useUSDCBalance } from "@/lib/hooks/useUSDCBalance";
import { shortenAddress } from "@/lib/utils";

// Mock data for the wallet page
const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    merchant: "Starbucks Coffee",
    amount: 4.50,
    currency: "$",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    category: "coffee",
    carbonFootprint: 0.8,
    carbonOffset: 0.5,
    sustainabilityScore: 65,
    recommendation: "Consider local coffee shops with reusable cup programs for better sustainability impact."
  },
  {
    id: "tx2",
    merchant: "Whole Foods Market",
    amount: 32.75,
    currency: "$",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    category: "shopping",
    carbonFootprint: 2.1,
    carbonOffset: 2.5,
    sustainabilityScore: 82,
  },
  {
    id: "tx3",
    merchant: "Amazon",
    amount: 49.99,
    currency: "$",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    category: "shopping",
    carbonFootprint: 4.2,
    carbonOffset: 1.8,
    sustainabilityScore: 45,
    recommendation: "Consider buying from local stores to reduce shipping emissions."
  }
];

// Wallet feature cards
const walletFeatures = [
  {
    title: "MetaMask Card Connection",
    description: "Securely connect your MetaMask Card to track and improve your spending.",
    icon: CreditCardIcon,
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },
  {
    title: "Carbon Offset Credits",
    description: "Automatically purchase carbon credits to offset your carbon footprint.",
    icon: Sparkles,
    color: "bg-gradient-to-br from-green-400 to-green-600"
  },
  {
    title: "Sustainability Fund",
    description: "Contribute to eco-friendly projects and initiatives with each purchase.",
    icon: Heart,
    color: "bg-gradient-to-br from-pink-400 to-pink-600"
  },
  {
    title: "Transaction History",
    description: "View your complete spending history with sustainability insights.",
    icon: Receipt,
    color: "bg-gradient-to-br from-blue-400 to-blue-600"
  },
  {
    title: "Safe & Secure",
    description: "Your data is encrypted and secure, with zero access to your private keys.",
    icon: Shield,
    color: "bg-gradient-to-br from-purple-400 to-purple-600"
  },
  {
    title: "Easy Fund Management",
    description: "Transfer funds between MetaMask wallet and card with ease.",
    icon: ArrowDownUp,
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600"
  }
];

// Recent activities
const recentActivities = [
  {
    title: "New Transaction",
    description: "Purchase at Starbucks Coffee",
    time: "2 hours ago",
    icon: Receipt,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Carbon Offset",
    description: "0.5kg CO₂ offset purchased",
    time: "2 hours ago",
    icon: Sparkles,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Fund Transfer",
    description: "$50 added to your card",
    time: "Yesterday",
    icon: CircleDollarSign,
    color: "bg-purple-100 text-purple-600"
  }
];

// Dynamically import motion components with no SSR for animated backgrounds
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // Use our USDC balance hook
  const { 
    formattedBalance: usdcBalance, 
    isLoading: isLoadingUSDC,
    executeTopUp,
    refetch: refetchUSDCBalance
  } = useUSDCBalance({
    walletAddress,
    autoTopUp: true,
    topUpThreshold: 50,
    topUpAmount: 100
  });
  
  // Handle wallet connection
  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-[#fcfcfd] to-[#f5f5f7]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ff580010,#ff580005,transparent)] z-0" />
        <MotionDiv
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-400/5 to-orange-500/10 blur-3xl"
        />
        <MotionDiv
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-green-400/5 to-green-500/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <MainNav />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 max-w-[1400px]">
          {/* Page header */}
          {/* <div className="py-8 lg:py-12 max-w-[85%] mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="inline-block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  MetaMask Card
                </span>
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Connect your MetaMask Card to track and optimize your sustainable spending
              </motion.p>
            </motion.div>
          </div> */}

          {/* Connect Card Section */}
          <Card className="mb-20 pt-12 overflow-visible relative border-none bg-transparent shadow-none">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="relative z-10"
                >
                  <div className="bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-3xl shadow-[0_8px_32px_rgb(0,0,0,0.04)] border border-gray-100/50">
                    <motion.h2 
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Connect Your Card
                      </span>
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600 mb-10 text-base sm:text-lg lg:text-xl font-medium leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                    >
                      Link your MetaMask Card to ConsizeN to start tracking your sustainable spending 
                      and automatically offset your carbon footprint.
                    </motion.p>
                    <div className="space-y-8">
                      {[
                        "Connect your MetaMask wallet",
                        "Link your MetaMask Card",
                        "Start making sustainable purchases"
                      ].map((step, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center gap-5 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 0.5 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-xl opacity-40 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                            <div className="relative z-10 h-12 w-12 rounded-full flex items-center justify-center bg-white border-2 border-orange-200 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <span className="text-base sm:text-lg text-gray-700 font-medium transform transition-transform duration-300 group-hover:translate-x-1">
                            {step}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div 
                      className="mt-12"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 1.2 }}
                    >
                      <WalletConnectButton 
                        className="w-full sm:w-auto text-lg px-12 py-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 
                        shadow-lg hover:shadow-orange-400/30 hover:shadow-2xl rounded-2xl text-white font-semibold transition-all duration-300 
                        hover:scale-[1.02] focus:scale-[0.98] active:scale-[0.98]"
                        onWalletConnected={handleWalletConnected}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative flex justify-center items-center py-12 lg:py-0"
                >
                  {/* Floating Elements */}
                  <MotionDiv
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute top-20 -right-10 w-16 h-16 text-orange-500 opacity-70"
                  >
                    <CreditCardIcon className="w-full h-full drop-shadow-lg" />
                  </MotionDiv>

                  <MotionDiv
                    animate={{ 
                      y: [0, 15, 0],
                      rotate: [0, -8, 0]
                    }}
                    transition={{ 
                      duration: 9, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute -bottom-10 left-10 w-12 h-12 text-purple-500 opacity-70"
                  >
                    <Sparkles className="w-full h-full drop-shadow-lg" />
                  </MotionDiv>

                  <MotionDiv
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute -bottom-20 right-1/4 w-32 h-32 bg-gradient-to-br from-orange-300/20 to-orange-500/30 rounded-full blur-3xl"
                  />

                  <MotionDiv
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-metamask-300/20 to-metamask-500/30 rounded-full blur-3xl"
                  />
                  
                  {/* Card Image with Glow */}
                  <motion.div
                    whileHover={{ 
                      rotate: [-1, 1],
                      scale: 1.02,
                      transition: { 
                        rotate: {
                          duration: 0.3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        },
                        scale: {
                          duration: 0.2
                        }
                      }
                    }}
                    className="relative"
                  >
                    {/* Glow Effects */}
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-orange-600/30 blur-3xl transform scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent blur-2xl transform scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-tl from-metamask-400/20 via-metamask-300/10 to-transparent blur-xl" />
                    </div>
                    
                    <Image
                      src="/card-stack.png"
                      alt="MetaMask Card"
                      width={600}
                      height={390}
                      className="transform transition-transform duration-500 drop-shadow-2xl"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Card Features
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover the powerful features that make your MetaMask Card experience seamless and sustainable
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {walletFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-100/50 bg-white/80 backdrop-blur-sm h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card border-white/30 col-span-1 shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg gap-2">
                    <CircleDollarSign className="h-5 w-5 text-metamask-500" />
                    Card Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">$358.42</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowRight className="h-3 w-3 rotate-45 mr-1" />
                    +$50.00 today
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card border-white/30 col-span-1 shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg gap-2">
                    <CircleDollarSign 
                      className="h-5 w-5 text-blue-500" 
                    />
                    USDC Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {walletAddress ? (
                    <>
                      {isLoadingUSDC ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-gray-900">${usdcBalance}</div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-500">
                              {walletAddress && shortenAddress(walletAddress)}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => refetchUSDCBalance()}
                              className="text-xs"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Refresh
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500">Connect wallet to view balance</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card border-white/30 col-span-1 shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg gap-2">
                    <LineChart className="h-5 w-5 text-blue-500" />
                    Sustainability Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">78/100</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowRight className="h-3 w-3 rotate-45 mr-1" />
                    +3 points this week
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Auto Top-Up Card */}
          {walletAddress && (
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="glass-card border-white/30 shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      Auto Top-Up
                    </CardTitle>
                    <CardDescription>
                      Automatically top up your USDC balance when it falls below a threshold
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current threshold: <span className="font-medium">$50.00</span></p>
                        <p className="text-sm text-gray-600">Top-up amount: <span className="font-medium">$100.00</span></p>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        onClick={() => executeTopUp(100)}
                        disabled={isLoadingUSDC}
                      >
                        {isLoadingUSDC ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Top Up Now
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Tabs Section */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-12"
            >
              <TabsList className="glass grid grid-cols-3 w-full max-w-md mx-auto mb-8 border border-white/30 rounded-xl overflow-hidden shadow-lg bg-white/50 backdrop-blur-sm p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-orange-500 data-[state=active]:text-white px-4 py-3 text-lg rounded-lg transition-all duration-300"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="spend"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white px-4 py-3 text-lg rounded-lg transition-all duration-300"
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-purple-500 data-[state=active]:text-white px-4 py-3 text-lg rounded-lg transition-all duration-300"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Card Activity Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <Card className="glass-card border-white/30 h-full shadow-xl bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Receipt className="h-5 w-5 text-metamask-500" />
                            Recent Transactions
                          </CardTitle>
                          <Button variant="outline" size="sm" className="border-metamask-200 text-metamask-700 hover:bg-metamask-50 rounded-lg">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription className="text-gray-500">
                          Your recent MetaMask Card transactions with sustainability scores
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <motion.div className="space-y-4">
                          {mockTransactions.map((transaction, index) => (
                            <motion.div
                              key={transaction.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <TransactionCard transaction={transaction} />
                            </motion.div>
                          ))}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="md:col-span-1">
                    <Card className="glass-card border-white/30 h-full shadow-xl bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Bell className="h-5 w-5 text-metamask-500" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div className="space-y-4">
                          {recentActivities.map((activity, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                            >
                              <div className={`w-9 h-9 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <activity.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-grow">
                                <div className="font-medium text-base">{activity.title}</div>
                                <div className="text-sm text-gray-500">{activity.description}</div>
                                <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Spending Tab */}
              <TabsContent value="spend" className="space-y-6">
                <Card className="glass-card border-white/30 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <LineChart className="h-5 w-5 text-metamask-500" />
                      Spending Analysis
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Understand your spending patterns and sustainability impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Spending charts will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="glass-card border-white/30 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Settings className="h-5 w-5 text-metamask-500" />
                      Card Settings
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Manage your MetaMask Card settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-base">Card Security</div>
                            <div className="text-sm text-gray-500">Manage your card security settings</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-metamask-200 text-metamask-700 hover:bg-metamask-50 rounded-lg">
                          Manage
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-base">Carbon Offset Settings</div>
                            <div className="text-sm text-gray-500">Configure automatic carbon offset purchases</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-metamask-200 text-metamask-700 hover:bg-metamask-50 rounded-lg">
                          Configure
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <ExternalLink className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-base">MetaMask Dashboard</div>
                            <div className="text-sm text-gray-500">Access your MetaMask Card dashboard</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-metamask-200 text-metamask-700 hover:bg-metamask-50 rounded-lg">
                          Visit
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}