/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import MainNav from "@/components/layout/MainNav";
import { ExternalLink, ArrowLeftRight, Wallet, Activity, RefreshCw } from "lucide-react";
import Link from "next/link";
import { AutoTopAgent } from "@/components/wallet/AutoTopAgent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUSDCBalance } from "@/lib/hooks/useUSDCBalance";

// Network configurations
const NETWORKS = {
  sepolia: {
    name: "Sepolia",
    chainId: "0xaa36a7", // 11155111 in decimal
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorer: "https://sepolia.etherscan.io",
    color: "orange"
  },
  lineaSepolia: {
    name: "Linea Sepolia",
    chainId: "0xe705", // 59141 in decimal
    rpcUrl: "https://rpc.sepolia.linea.build",
    blockExplorer: "https://sepolia.lineascan.build",
    color: "green"
  }
};

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    date: new Date().toISOString(),
    amount: 10.00,
    description: "AI Agent Rewards",
    network: "sepolia",
    txHash: "0x123..."
  },
  {
    id: "tx2",
    date: new Date(Date.now() - 86400000).toISOString(),
    amount: 10.00,
    description: "Sustainability Score Bonus",
    network: "sepolia",
    txHash: "0x456..."
  }
];

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<"sepolia" | "lineaSepolia">("sepolia");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Use our USDC balance hook
  const { 
    formattedBalance: usdcBalance, 
    isLoading: isLoadingUSDC,
    refetch: refetchUSDCBalance
  } = useUSDCBalance({
    walletAddress,
    chainId: currentNetwork === "sepolia" ? 11155111 : 59141
  });

  useEffect(() => {
    // Check wallet connection
    const checkWallet = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          const isConnected = accounts && accounts.length > 0;
          setWalletAddress(isConnected ? accounts[0] as string : null);
          setIsWalletConnected(isConnected);

          // Check current network
          if (isConnected) {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            handleChainChanged(chainId);
          }
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };

    checkWallet();

    // Listen for account or network changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", checkWallet);
      window.ethereum.on("chainChanged", checkWallet);

      return () => {
        window.ethereum.removeListener("accountsChanged", checkWallet);
        window.ethereum.removeListener("chainChanged", checkWallet);
      };
    }
  }, []);

  // Handle chain changes
  const handleChainChanged = (chainId: string) => {
    if (chainId === NETWORKS.sepolia.chainId) {
      setCurrentNetwork("sepolia");
    } else if (chainId === NETWORKS.lineaSepolia.chainId) {
      setCurrentNetwork("lineaSepolia");
    }
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

  // Get transaction explorer URL
  const getExplorerUrl = (txHash: string) => {
    const explorer = currentNetwork === "sepolia" ? NETWORKS.sepolia.blockExplorer : NETWORKS.lineaSepolia.blockExplorer;
    return `${explorer}/tx/${txHash}`;
  };

  // Handle auto top-up
  const handleAutoTopUp = async (amount: number) => {
    console.log("Auto top-up requested:", amount);
    toast.success(`Auto top-up initiated for ${amount} USDC`);
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (typeof window !== "undefined" && window.ethereum) {
        // Request accounts
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        
        // Get the current network
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          handleChainChanged(chainId);
        } catch (chainError) {
          console.error('Error getting chain ID:', chainError);
        }
      } else {
        console.error('MetaMask is not installed');
        setError('MetaMask is not installed. Please install MetaMask to continue.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (networkName: string) => {
    try {
      setIsSwitchingNetwork(true);
      setIsLoading(true);
      
      if (typeof window !== "undefined" && window.ethereum) {
        if (networkName === 'sepolia') {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
          });
          setCurrentNetwork("sepolia");
        } else if (networkName === 'lineaSepolia') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xe705' }], // Linea Sepolia chain ID
            });
            setCurrentNetwork("lineaSepolia");
          } catch (error) {
            // If the chain doesn't exist, add it
            const switchError = error as { code: number };
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xe705',
                    chainName: 'Linea Sepolia',
                    nativeCurrency: {
                      name: 'Linea Ether',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://rpc.sepolia.linea.build'],
                    blockExplorerUrls: ['https://sepolia.lineascan.build'],
                  },
                ],
              });
              setCurrentNetwork("lineaSepolia");
            } else {
              throw error;
            }
          }
        }
        toast.success(`Switched to ${networkName === 'sepolia' ? 'Sepolia' : 'Linea Sepolia'} network`);
      } else {
        console.error('MetaMask is not installed');
        setError('MetaMask is not installed. Please install MetaMask to continue.');
      }
    } catch (error) {
      console.error('Error switching network:', error);
      setError('Failed to switch network. Please try again.');
      toast.error(`Failed to switch network`);
    } finally {
      setIsSwitchingNetwork(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <MainNav />
      <div className="container max-w-6xl mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 inline-block text-transparent bg-clip-text">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Overview of your wallet activity and sustainability impact
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Badge 
              variant="outline" 
              className={`px-4 py-2 text-sm font-medium border ${
                currentNetwork === "sepolia" 
                  ? "bg-orange-100 text-orange-800 border-orange-200" 
                  : "bg-green-100 text-green-800 border-green-200"
              }`}
            >
              {currentNetwork === "sepolia" ? "Sepolia" : "Linea Sepolia"} Testnet
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              className={`flex items-center gap-2 ${
                currentNetwork === "sepolia" 
                  ? "text-orange-600 border-orange-200 hover:bg-orange-50" 
                  : "text-green-600 border-green-200 hover:bg-green-50"
              }`}
              onClick={() => switchNetwork(currentNetwork === "sepolia" ? "lineaSepolia" : "sepolia")}
              disabled={isLoading || isSwitchingNetwork}
            >
              <ArrowLeftRight className="w-4 h-4" />
              Switch to {currentNetwork === "sepolia" ? "Linea Sepolia" : "Sepolia"}
              {(isLoading || isSwitchingNetwork) && <span className="animate-spin ml-2">⏳</span>}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transactions */}
            <Card className="border-orange-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your recent activity on the {currentNetwork === "sepolia" ? "Sepolia" : "Linea Sepolia"} testnet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-4 rounded-lg border bg-white/80 hover:border-orange-200 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{tx.description}</div>
                          <div className="text-sm text-gray-600">{formatDate(tx.date)}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium text-orange-600">{tx.amount} USDC</div>
                          </div>
                          {tx.txHash && (
                            <Link 
                              href={getExplorerUrl(tx.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full hover:bg-orange-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-orange-500" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Stats */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Sustainability Impact
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your environmental impact across all networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                    <div className="text-sm text-gray-600">Sustainability Score</div>
                    <div className="text-2xl font-bold text-orange-600">78/100</div>
                    <div className="text-xs text-gray-500">+5 from last month</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                    <div className="text-sm text-gray-600">Carbon Offset</div>
                    <div className="text-2xl font-bold text-green-600">2.4 kg</div>
                    <div className="text-xs text-gray-500">CO₂ equivalent</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                    <div className="text-sm text-gray-600">Eco Rewards</div>
                    <div className="text-2xl font-bold text-orange-600">255 USDC</div>
                    <div className="text-xs text-gray-500">Total earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Card */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isWalletConnected ? (
                  <>
                    <div className="bg-white/80 rounded-lg p-3 mb-3 shadow-sm border border-orange-100">
                      <div className="text-xs text-gray-600 mb-1">Address</div>
                      <div className="text-sm font-mono truncate text-gray-900">{walletAddress}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-orange-100">
                        <div className="text-xs text-gray-600 mb-1">Sepolia</div>
                        <div className="text-lg font-bold text-orange-600">
                          {currentNetwork === "sepolia" ? (
                            isLoadingUSDC ? "Loading..." : `${usdcBalance} USDC`
                          ) : "0 USDC"}
                        </div>
                      </div>
                      <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-green-100">
                        <div className="text-xs text-gray-600 mb-1">Linea Sepolia</div>
                        <div className="text-lg font-bold text-green-700">
                          {currentNetwork === "lineaSepolia" ? (
                            isLoadingUSDC ? "Loading..." : `${usdcBalance} USDC`
                          ) : "Connect to view"}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetchUSDCBalance()}
                      className="mt-3 w-full bg-white/90 text-gray-800 border-gray-300 hover:bg-gray-100"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh Balance
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">Connect your wallet to view your balance</p>
                    <Button 
                      onClick={connectWallet} 
                      disabled={isConnecting}
                      className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                    >
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </Button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Auto-Top Agent */}
            <AutoTopAgent 
              isWalletConnected={isWalletConnected}
              walletAddress={walletAddress}
              onTopUp={handleAutoTopUp}
              network={currentNetwork === "sepolia" ? "sepolia" : "lineaSepolia"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}