"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, CreditCard, Heart, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-white/20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="ConsizeN Logo" 
                width={36} 
                height={36} 
              />
              <span className="font-bold text-xl">ConsizeN</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Making your MetaMask Card transactions more sustainable with AI-powered carbon offsets and eco-friendly recommendations.
            </p>
            <div className="flex items-center gap-3">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-metamask-100 hover:text-metamask-600 transition-colors">
                  <Twitter className="h-4 w-4" />
                </div>
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-metamask-100 hover:text-metamask-600 transition-colors">
                  <Facebook className="h-4 w-4" />
                </div>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-metamask-100 hover:text-metamask-600 transition-colors">
                  <Instagram className="h-4 w-4" />
                </div>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-metamask-100 hover:text-metamask-600 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Dashboard", href: "/dashboard" },
                { name: "Wallet", href: "/wallet/metamask" },
                { name: "Sustainability", href: "/sustainability" },
                { name: "Community", href: "/community" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-metamask-600 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: "MetaMask Docs", href: "https://docs.metamask.io" },
                { name: "Carbon Offset Partners", href: "#" },
                { name: "Developer API", href: "#" },
                { name: "Help Center", href: "#" },
                { name: "Privacy Policy", href: "#" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-metamask-600 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates on sustainable spending features and carbon offset initiatives.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-metamask-500 focus:border-transparent text-sm"
                />
              </div>
              <Button className="bg-metamask-500 hover:bg-metamask-600">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* MetaMask Partnership */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Powered by</span>
              <Image 
                src="/metamask-logo.png" 
                alt="MetaMask Logo" 
                width={120} 
                height={28} 
                className="h-7 w-auto object-contain"
              />
            </div> */}
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <CreditCard className="h-4 w-4 text-metamask-500" />
                <span>MetaMask Card Integration</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span>AI-Powered Sustainability</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Global Carbon Offsets</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} ConsizeN. All rights reserved. Made with <Heart className="inline-block h-3 w-3 text-red-500" /> for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
} 



