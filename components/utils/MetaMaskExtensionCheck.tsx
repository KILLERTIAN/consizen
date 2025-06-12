"use client";

import { useEffect, useState } from "react";

export function MetaMaskExtensionCheck() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== "undefined") {
        setIsMetaMaskInstalled(window.ethereum?.isMetaMask || false);
      }
    };

    checkMetaMask();
  }, []);

  if (isMetaMaskInstalled === null) {
    return <div>Checking for MetaMask...</div>;
  }

  return (
    <div className="p-4 rounded-lg bg-gray-100 mb-4">
      <h3 className="font-medium text-lg mb-2">MetaMask Status:</h3>
      {isMetaMaskInstalled ? (
        <p className="text-green-600">MetaMask is installed! ✅</p>
      ) : (
        <p className="text-red-600">MetaMask is not installed. Please install it to use this app.</p>
      )}
    </div>
  );
} 