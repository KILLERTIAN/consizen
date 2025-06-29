"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Menu as MenuIcon, Home as HomeIcon, BarChart as BarChartIcon, Wallet as WalletIcon, Leaf as LeafIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

// Dynamically import motion components with no SSR
import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
    requiresWallet: false
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChartIcon,
    requiresWallet: true
  },
  {
    name: "Wallet",
    href: "/wallet",
    icon: WalletIcon,
    requiresWallet: true
  },
  {
    name: "Sustainability",
    href: "/sustainability",
    icon: LeafIcon,
    requiresWallet: false
  }
];

const MainNav = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Check wallet connection on mount and when it changes
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setIsWalletConnected(accounts && accounts.length > 0);
      }
    };

    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setIsWalletConnected(accounts && accounts.length > 0);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  // Filter nav items based on wallet connection
  const filteredNavItems = navItems.filter(item => !item.requiresWallet || isWalletConnected);

  // Handle scroll effect for transparent to glass
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "nav-blur py-2 shadow-lg backdrop-blur-md"
          : "bg-white/50 backdrop-blur-sm py-3"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <MotionDiv
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image src="/logo.png" alt="ConsizeN" width={36} height={36} className="rounded-lg" />
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900">ConsizeN</span>
              </div>
            </MotionDiv>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-grow max-w-md mx-auto">
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              {filteredNavItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <MotionDiv
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative"
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`relative px-2.5 sm:px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                            : "text-gray-800 hover:text-orange-600 hover:bg-orange-50 hover:shadow-sm"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 mr-1.5 sm:mr-2 ${isActive ? 'animate-pulse' : ''}`} />
                        <span className="text-sm whitespace-nowrap">{item.name}</span>
                        
                        {isActive && (
                          <MotionDiv
                            className="nav-indicator"
                            layoutId="activeNavItem"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </Button>
                    </MotionDiv>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Actions - desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <WalletConnectButton />
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <WalletConnectButton className="scale-90 mr-1" />
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full text-gray-800 bg-gradient-to-r from-white/80 to-gray-100/80 hover:bg-white hover:shadow-md transition-all flex items-center justify-center border border-gray-200"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-6 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border-l border-white/30 shadow-2xl">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 shadow-sm border border-orange-500/20">
                        <Image src="/logo.png" alt="ConsizeN" width={36} height={36} className="rounded-lg" />
                      </div>
                      <span className="font-bold text-2xl text-gray-900">ConsizeN</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-3">
                  {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start px-4 py-5 text-base rounded-xl transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                              : "text-gray-800 hover:text-orange-600 hover:bg-orange-50/70 hover:shadow-sm"
                          }`}
                        >
                          <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'animate-pulse' : ''}`} />
                          <span className="font-medium">{item.name}</span>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-orange-500 to-orange-600 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                          )}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
                <div className="absolute bottom-8 left-6 right-6">
                  <div className="text-center text-sm text-gray-600">
                    <span className="font-medium text-orange-600">ConsizeN</span> &copy; {new Date().getFullYear()} <br /> Sustainable Spending Agent
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav; 
