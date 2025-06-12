"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BarChart2, Leaf, TrendingUp, Wallet } from "lucide-react";
import MainNav from "@/components/layout/MainNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SustainabilityCard from "@/components/cards/SustainabilityCard";
import TransactionCard from "@/components/cards/TransactionCard";
import { Transaction } from "@/lib/types";

// Mock data for the dashboard
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
  },
  {
    id: "tx4",
    merchant: "Uber",
    amount: 12.50,
    currency: "$",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    category: "transport",
    carbonFootprint: 1.9,
    carbonOffset: 1.0,
    sustainabilityScore: 55,
    recommendation: "Consider public transportation or biking for short trips."
  }
];

// Stats data
const stats = [
  {
    title: "Total Spent",
    value: "$124.74",
    change: "+12%",
    trend: "up",
    icon: Wallet,
    color: "bg-gradient-to-r from-metamask-500 to-metamask-600"
  },
  {
    title: "Sustainability Score",
    value: "78",
    change: "+5%",
    trend: "up",
    icon: Leaf,
    color: "bg-gradient-to-r from-sustainability-500 to-sustainability-600"
  },
  {
    title: "Carbon Offset",
    value: "6.5kg",
    change: "+18%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-gradient-to-r from-carbon-500 to-carbon-600"
  },
  {
    title: "Transactions",
    value: "12",
    change: "+3",
    trend: "up",
    icon: BarChart2,
    color: "bg-gradient-to-r from-blue-500 to-blue-600"
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Page header */}
        <div className="py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your sustainable spending impact and carbon footprint
            </p>
          </motion.div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: stat.color }}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="h-6">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Main Content Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="glass grid grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-sustainability-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-sustainability-500 data-[state=active]:text-white"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="impact" 
              className="data-[state=active]:bg-sustainability-500 data-[state=active]:text-white"
            >
              Impact
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sustainability Overview */}
              <div className="md:col-span-2 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Sustainability Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Sustainability charts will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Carbon Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Carbon impact charts will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Transactions and Sustainability Card */}
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Activity</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-3">
                      {mockTransactions.slice(0, 2).map((transaction) => (
                        <TransactionCard
                          key={transaction.id}
                          transaction={transaction}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <SustainabilityCard
                  title="This Month's Impact"
                  score={78}
                  carbonFootprint={9.8}
                  carbonOffset={12.5}
                  recommendation="You're doing great! Your sustainable choices have prevented 2.7kg of CO₂ emissions this month."
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>All Transactions</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      Sort
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Carbon Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">Carbon savings chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Sustainability Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">Sustainability growth chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Impact Opportunities</CardTitle>
                    <Button>
                      View All Opportunities
                      <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-white/50">
                        <CardContent className="p-4">
                          <div className="h-8 w-8 rounded-full bg-sustainability-100 text-sustainability-700 flex items-center justify-center mb-3">
                            <Leaf className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium mb-1">Impact Opportunity {i}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {i === 1 
                              ? "Switch to eco-friendly merchants for your coffee purchases."
                              : i === 2
                                ? "Offset your Amazon orders by planting trees."
                                : "Try carpooling or public transit for your commute."
                            }
                          </p>
                          <div className="text-xs text-gray-500">
                            Potential savings: {i * 1.2}kg CO₂
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 