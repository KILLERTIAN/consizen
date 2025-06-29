"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import motion components with no SSR
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

interface CircleWalletButtonProps {
  className?: string;
}

const CircleWalletButton = ({ className = "" }: CircleWalletButtonProps) => {
  const router = useRouter();

  const navigateToCircleWallet = () => {
    toast.info("Navigating to Circle wallet");
    router.push("/wallet/circle");
  };

  return (
    <MotionDiv
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      <Button
        onClick={navigateToCircleWallet}
        className="ios-button flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
      >
        <Wallet className="h-4 w-4" />
        <span>Circle Wallet</span>
      </Button>
    </MotionDiv>
  );
};

export default CircleWalletButton; 

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import motion components with no SSR
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

interface CircleWalletButtonProps {
  className?: string;
}

const CircleWalletButton = ({ className = "" }: CircleWalletButtonProps) => {
  const router = useRouter();

  const navigateToCircleWallet = () => {
    toast.info("Navigating to Circle wallet");
    router.push("/wallet/circle");
  };

  return (
    <MotionDiv
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      <Button
        onClick={navigateToCircleWallet}
        className="ios-button flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
      >
        <Wallet className="h-4 w-4" />
        <span>Circle Wallet</span>
      </Button>
    </MotionDiv>
  );
};

export default CircleWalletButton; 