"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Loader2, CreditCard } from "lucide-react";
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
// import CardLinkingModal from "./CardLinkingModal";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import motion components with no SSR
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

// Define Ethereum window type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      selectedAddress?: string;
      chainId?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on: (event: string, callback: (...args: any[]) => void) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

// Types for wallet connection
interface WalletConnectButtonProps {
  className?: string;
  walletType?: 'metamask' | 'circle';
  onWalletConnected?: (address: string) => void;
}

enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error"
}

// Network parameters
const SEPOLIA_TESTNET = {
  chainId: "0xaa36a7", // 11155111 in decimal
  chainName: "Ethereum Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.infura.io/v3/"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
} as const;

// Default network to use
const DEFAULT_NETWORK = SEPOLIA_TESTNET;

export default function WalletConnectButton({ 
  className = "", 
  walletType = 'metamask',
  onWalletConnected 
}: WalletConnectButtonProps) {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => handleAccountsChanged(accounts as string[]))
        .catch((err: Error) => {
          console.error(err);
        });

      // Check current network
      checkNetwork();

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => handleAccountsChanged(accounts as string[]));
      window.ethereum.on("chainChanged", () => checkNetwork());

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", (accounts) => handleAccountsChanged(accounts as string[]));
          window.ethereum.removeListener("chainChanged", () => checkNetwork());
        }
      };
    }
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setStatus(ConnectionStatus.DISCONNECTED);
    } else {
      setAccount(accounts[0]);
      setStatus(ConnectionStatus.CONNECTED);
      // Get balance
      if (window.ethereum) {
        window.ethereum
          .request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })
          .then((result) => {
            // Convert from wei to ETH
            const ethBalance = parseInt(result as string, 16) / 1e18;
            setBalance(ethBalance.toFixed(4));
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const checkNetwork = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setIsCorrectNetwork(chainId === DEFAULT_NETWORK.chainId);
      } catch (error) {
        console.error("Error checking network:", error);
      }
    }
  };

  const switchToCorrectNetwork = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        setStatus(ConnectionStatus.CONNECTING);
        
        // Try to switch to the correct network
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: DEFAULT_NETWORK.chainId }],
          });
        } catch (error) {
          const switchError = error as { code: number };
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [DEFAULT_NETWORK],
            });
          } else {
            throw error;
          }
        }
        
        setIsCorrectNetwork(true);
        toast.success(`Successfully switched to ${DEFAULT_NETWORK.chainName} network`);
      } catch (error) {
        console.error("Failed to switch network:", error);
        toast.error(`Failed to switch to ${DEFAULT_NETWORK.chainName} network`);
        setStatus(ConnectionStatus.ERROR);
        setError(`Failed to switch to ${DEFAULT_NETWORK.chainName} network`);
      }
    }
  };

  // Handle Circle wallet connection
  const handleCircleWalletConnection = async () => {
    if (walletType === 'circle') {
      router.push("/wallet/circle");
      return;
    }
  };

  const connectWallet = async () => {
    if (walletType === 'circle') {
      handleCircleWalletConnection();
      return;
    }

    if (typeof window !== "undefined" && window.ethereum) {
      try {
        setStatus(ConnectionStatus.CONNECTING);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        handleAccountsChanged(accounts as string[]);
        
        // Check if on correct network, if not, switch
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId !== DEFAULT_NETWORK.chainId) {
          await switchToCorrectNetwork();
        }

        if (onWalletConnected && accounts && accounts.length > 0) {
          onWalletConnected(accounts[0] as string);
        }
        
        toast.success("Wallet connected successfully");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet");
        setStatus(ConnectionStatus.ERROR);
        setError("Failed to connect wallet");
      }
    } else {
      toast.error("MetaMask is not installed. Please install MetaMask to connect.");
      window.open("https://metamask.io/download/", "_blank");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setStatus(ConnectionStatus.DISCONNECTED);
    toast.info("Wallet disconnected");
  };

  const getButtonText = () => {
    if (account) {
      return isCorrectNetwork 
        ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
        : `Switch to ${DEFAULT_NETWORK.chainName}`;
    }
    return "Connect Wallet";
  };

  const handleClick = () => {
    if (account && !isCorrectNetwork) {
      switchToCorrectNetwork();
    } else if (!account) {
      connectWallet();
    }
  };

  // Render different button states based on connection status and wallet type
  const renderButtonContent = () => {
    const isCircle = walletType === 'circle';
    const gradientColors = isCircle 
      ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700';

    switch (status) {
      case ConnectionStatus.CONNECTED:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className={`bg-gradient-to-r ${isCircle ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'} text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
                        onClick={handleClick}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-white/30">
                            <AvatarImage 
                              src={isCircle ? "/circle-logo.svg" : `https://effigy.im/a/${account}.svg`} 
                              alt={isCircle ? "Circle" : "MetaMask"} 
                            />
                            <AvatarFallback className={`${isCircle ? 'bg-blue-500' : 'bg-orange-500'} text-white text-xs`}>
                              {isCircle ? 'CR' : 'MM'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {getButtonText()}
                          </span>
                          {balance && (
                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                              {balance} ETH
                            </span>
                          )}
                        </div>
                      </Button>
                    </MotionDiv>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-xl">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Connected to {isCircle ? 'Circle' : 'MetaMask'}
                        </span>
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
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost"
                          size="sm" 
                          className="mt-1 flex-1 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Link Card
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm" 
                          className="mt-1 flex-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            disconnectWallet();
                          }}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connected to {isCircle ? 'Circle' : 'MetaMask'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      
      case ConnectionStatus.CONNECTING:
        return (
          <MotionDiv
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Button 
              className={`bg-gradient-to-r ${gradientColors} text-white px-4 py-2.5 rounded-xl shadow-md ${className}`}
              disabled
            >
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Connecting...</span>
              </div>
            </Button>
          </MotionDiv>
        );
      
      case ConnectionStatus.ERROR:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
                  onClick={handleClick}
                >
                  <div className="flex items-center gap-2">
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
      
      default:
        return (
          <MotionDiv
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className={`bg-gradient-to-r ${gradientColors} text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
              onClick={handleClick}
            >
              Connect {isCircle ? 'Circle' : 'MetaMask'}
            </Button>
          </MotionDiv>
        );
    }
  };

  return (
    <>
      {renderButtonContent()}
      
      {/* Uncomment when CardLinkingModal is implemented */}
      {/* <CardLinkingModal
        open={isCardModalOpen}
        onOpenChange={setIsCardModalOpen}
        walletAddress={account}
      /> */}
    </>
  );
}