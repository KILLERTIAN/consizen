"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function MetaMaskExtensionCheck() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean | null>(null);
  const [isCheckingInstallation, setIsCheckingInstallation] = useState(true);

  useEffect(() => {
    const checkMetaMaskInstallation = () => {
      setIsCheckingInstallation(true);
      
      // Check if MetaMask is installed
      if (typeof window !== 'undefined') {
        const { ethereum } = window;
        
        // Check if ethereum object exists and it's MetaMask
        if (ethereum) {
          const isMetaMask = !!ethereum.isMetaMask;
          setIsMetaMaskInstalled(isMetaMask);
        } else {
          setIsMetaMaskInstalled(false);
        }
      }
      
      setIsCheckingInstallation(false);
    };

    // Add a small delay to ensure window.ethereum is properly initialized
    const timer = setTimeout(() => {
      checkMetaMaskInstallation();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle install MetaMask button click
  const handleInstallClick = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  if (isCheckingInstallation) {
    return (
      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Image src="/metamask-logo.svg" alt="MetaMask" width={24} height={24} />
            Checking MetaMask...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
            <p>Checking if MetaMask is installed...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${isMetaMaskInstalled ? 'border-green-200' : 'border-orange-200'} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Image src="/metamask-logo.svg" alt="MetaMask" width={24} height={24} />
          MetaMask Extension
        </CardTitle>
        <CardDescription>
          {isMetaMaskInstalled 
            ? 'MetaMask extension is installed and ready to use'
            : 'MetaMask extension is required to use this application'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          {isMetaMaskInstalled ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-500" />
          )}
          <div>
            <p className="font-medium">
              {isMetaMaskInstalled ? 'MetaMask is installed' : 'MetaMask is not installed'}
            </p>
            <p className="text-sm text-gray-500">
              {isMetaMaskInstalled 
                ? 'You can connect your wallet to use all features'
                : 'Please install MetaMask to continue'
              }
            </p>
          </div>
        </div>
        
        {!isMetaMaskInstalled && (
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
          >
            Install MetaMask
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 