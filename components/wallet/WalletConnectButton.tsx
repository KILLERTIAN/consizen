"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronRight, Check, AlertCircle, Loader2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types for MetaMask connection
interface WalletConnectButtonProps {
  className?: string;
}

enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error"
}

const WalletConnectButton = ({ className = "" }: WalletConnectButtonProps) => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Simulate connection to MetaMask
  const connectWallet = async () => {
    setStatus(ConnectionStatus.CONNECTING);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: "eth_requestAccounts" 
        }) as string[];
        
        // Get account
        if (accounts && accounts.length > 0) {
          const userAccount = accounts[0];
          setAccount(userAccount);
          
          // Get balance
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [userAccount, "latest"],
          }) as string;
          
          // Convert balance from wei to ETH
          const etherBalance = parseInt(balance, 16) / 1e18;
          setBalance(etherBalance.toFixed(4));
          
          setStatus(ConnectionStatus.CONNECTED);
        } else {
          throw new Error("No accounts found");
        }
      } else {
        throw new Error("MetaMask not installed");
      }
    } catch (err: unknown) {
      console.error("Failed to connect to MetaMask:", err);
      setStatus(ConnectionStatus.ERROR);
      setError(err instanceof Error ? err.message : "Failed to connect");
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setStatus(ConnectionStatus.DISCONNECTED);
  };

  // Handle MetaMask account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setStatus(ConnectionStatus.DISCONNECTED);
          setAccount(null);
          setBalance(null);
        } else if (accounts[0] !== account) {
          // Account changed
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Check if already connected
      window.ethereum.request({ method: "eth_accounts" })
        .then((accounts: unknown) => {
          const ethAccounts = accounts as string[];
          if (ethAccounts && ethAccounts.length > 0) {
            setAccount(ethAccounts[0]);
            setStatus(ConnectionStatus.CONNECTED);
            
            // Get balance
            window.ethereum.request({
              method: "eth_getBalance",
              params: [ethAccounts[0], "latest"],
            }).then((balance: unknown) => {
              const balanceStr = balance as string;
              const etherBalance = parseInt(balanceStr, 16) / 1e18;
              setBalance(etherBalance.toFixed(4));
            });
          }
        })
        .catch(console.error);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [account]);

  // Render different button states based on connection status
  const renderButtonContent = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`bg-white/90 backdrop-blur-sm group px-4 py-2.5 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
                      onClick={disconnectWallet}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 border-2 border-green-500 p-0.5">
                          <AvatarImage src={`https://effigy.im/a/${account}.svg`} alt="MetaMask" />
                          <AvatarFallback className="bg-metamask-500 text-white text-xs">MM</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            {balance} ETH
                          </span>
                        </div>
                      </div>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-xl">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Connected to MetaMask</span>
                        <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                          <Check className="h-4 w-4" />
                          Connected
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 break-all font-mono bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                        {account}
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-600">Balance</div>
                        <div className="text-sm font-medium text-gray-900">{balance} ETH</div>
                      </div>
                      <Button 
                        variant="ghost"
                        size="sm" 
                        className="mt-1 w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        onClick={disconnectWallet}
                      >
                        Disconnect Wallet
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to disconnect</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      
      case ConnectionStatus.CONNECTING:
        return (
          <Button 
            variant="ghost" 
            className={`bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-200/50 shadow-sm ${className}`}
            disabled
          >
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              <span className="text-gray-600">Connecting...</span>
            </div>
          </Button>
        );
      
      case ConnectionStatus.ERROR:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl border border-red-200/50 shadow-sm ${className}`}
                  onClick={connectWallet}
                >
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Connection Failed</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-red-600">{error || "Connection error"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      
      case ConnectionStatus.DISCONNECTED:
      default:
        return (
          <Button 
            variant="ghost" 
            className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 ${className}`}
            onClick={connectWallet}
          >
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </div>
          </Button>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.2 }}
      >
        {renderButtonContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletConnectButton;