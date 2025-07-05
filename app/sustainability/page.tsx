"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, TreePine, Cloud, Droplets, Wind, Calculator, ArrowRight, Globe, Info } from "lucide-react";
import MainNav from "@/components/layout/MainNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import SustainabilityCard from "@/components/cards/SustainabilityCard";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Carbon impact categories
const impactCategories = [
  {
    name: "Carbon Emissions",
    value: 18.5,
    maxValue: 50,
    unit: "kg CO₂",
    icon: Cloud,
    color: "from-red-500 to-red-600",
    description: "Total carbon emissions from your purchases."
  },
  {
    name: "Carbon Offsets",
    value: 24.2,
    maxValue: 50,
    unit: "kg CO₂",
    icon: TreePine,
    color: "from-green-500 to-green-600",
    description: "Carbon offsets purchased automatically."
  },
  {
    name: "Water Impact",
    value: 1250,
    maxValue: 5000,
    unit: "liters",
    icon: Droplets,
    color: "from-blue-500 to-blue-600",
    description: "Water used in production of purchased goods."
  },
  {
    name: "Energy Impact",
    value: 45,
    maxValue: 100,
    unit: "kWh",
    icon: Wind,
    color: "from-orange-500 to-orange-600",
    description: "Energy consumption related to your spending."
  }
];

// Carbon offset projects
const offsetProjects = [
  {
    name: "Amazon Rainforest Conservation",
    description: "Protecting and restoring Amazon rainforest in Brazil.",
    impact: 8.2,
    unit: "kg CO₂",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=100&auto=format&fit=crop",
    progress: 65
  },
  {
    name: "Wind Energy Development",
    description: "Supporting wind farm projects in Texas, USA.",
    impact: 6.8,
    unit: "kg CO₂",
    image: "https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=100&auto=format&fit=crop",
    progress: 45
  },
  {
    name: "Ocean Plastic Removal",
    description: "Funding ocean cleanup initiatives in Southeast Asia.",
    impact: 5.4,
    unit: "kg CO₂",
    image: "https://images.unsplash.com/photo-1621451822246-36a34305a994?q=80&w=100&auto=format&fit=crop",
    progress: 32
  },
  {
    name: "Solar Energy Access",
    description: "Bringing solar power to communities in Africa.",
    impact: 3.8,
    unit: "kg CO₂",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=100&auto=format&fit=crop",
    progress: 24
  }
];

// Tips and actions
const sustainabilityTips = [
  "Shop from local businesses to reduce transportation emissions",
  "Choose products with minimal packaging to reduce waste",
  "Bring reusable bags when shopping to avoid plastic waste",
  "Select energy-efficient appliances and electronics",
  "Buy seasonal and locally grown produce",
  "Choose products made from recycled materials",
  "Repair items instead of replacing them when possible",
  "Opt for digital receipts to save paper"
];

export default function SustainabilityPage() {
  const [activeTab, setActiveTab] = useState("impact");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <MainNav />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Page header */}
        <div className="py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">Sustainability Impact</h1>
            <p className="text-gray-700 mt-2">
              Track and improve the environmental impact of your spending
            </p>
          </motion.div>
        </div>
        
        {/* Impact Summary Card */}
        <Card className="glass-card mb-8 overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-3 bg-green-100 text-green-800 border-green-200">
                  <Leaf className="h-3 w-3 mr-1" />
                  Net Positive Impact
                </Badge>
                <h2 className="text-2xl font-bold mb-3 text-green-600">Your Environmental Impact</h2>
                <p className="text-gray-700 mb-6">
                  Your sustainable spending choices have resulted in a net positive impact on the environment.
                  You&apos;ve saved 5.7kg CO₂ more than you&apos;ve emitted through your purchases.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-green-600">+5.7</div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">kg CO₂ saved</div>
                    <div className="text-xs text-gray-600">through your sustainable choices</div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    View Detailed Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="relative p-4">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/5"></div>
                  <div className="relative h-full">
                    <div className="p-3 bg-white/90 rounded-xl mb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div className="font-medium text-gray-800">Total Carbon Footprint</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          18.5 kg CO₂
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-white/90 rounded-xl mb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TreePine className="h-5 w-5 text-green-600" />
                          <div className="font-medium text-gray-800">Total Carbon Offsets</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          24.2 kg CO₂
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-white/90 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-purple-600" />
                          <div className="font-medium text-gray-800">Net Impact</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          +5.7 kg CO₂
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs Section */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="glass grid grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger 
              value="impact" 
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-700"
            >
              Impact Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="offsets" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-700"
            >
              Carbon Offsets
            </TabsTrigger>
            <TabsTrigger 
              value="tips" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-700"
            >
              Eco Tips
            </TabsTrigger>
          </TabsList>
          
          {/* Impact Metrics Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {impactCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="glass-card h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-800">{category.name}</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>{category.description}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-2xl font-bold mb-2 text-gray-900">
                        {category.value} {category.unit}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(category.value / category.maxValue) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">
                        {Math.round((category.value / category.maxValue) * 100)}% of typical consumer
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-gray-900">Impact Over Time</CardTitle>
                <CardDescription className="text-gray-600">
                  Your sustainability metrics tracked over the past 3 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-600">Impact charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Carbon Offsets Tab */}
          <TabsContent value="offsets" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-gray-900">Your Carbon Offset Projects</CardTitle>
                <CardDescription className="text-gray-600">
                  Projects you&apos;re supporting through your sustainable spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offsetProjects.map((project, index) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex gap-4 p-4 rounded-xl bg-white/50">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={project.image} 
                            alt={project.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1 text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Your contribution</span>
                            <span className="text-xs font-medium text-gray-800">{project.impact} {project.unit}</span>
                          </div>
                          <Progress value={project.progress} className="h-1" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-gray-900">Offset Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-600">Offset charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-gray-900">Impact Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-600">Impact visualization will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Eco Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
                          <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-gray-900">Sustainability Tips</CardTitle>
                  <CardDescription className="text-gray-600">
                    Ways to further reduce your environmental impact
                  </CardDescription>
                </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sustainabilityTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/50">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                          <Leaf className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{tip}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <SustainabilityCard
              title="Your Latest Purchase Analysis"
              score={72}
              carbonFootprint={2.1}
              carbonOffset={2.5}
              recommendation="Great choice! Your purchase at Whole Foods had a positive sustainability impact. Continue choosing organic and local products to maintain this positive trend."
              className="w-full md:w-2/3 mx-auto text-gray-900"
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 