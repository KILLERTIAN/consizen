"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Users, 
  Play,
  Brain, 
  Sparkles,
  Award,
  TreePine,
  CreditCard,
  BarChart3,
  Globe,
  ShieldCheck,
  FlameKindling,
  Lightbulb,
  Leaf,
  Recycle
} from "lucide-react";
import { Hero } from "@/components/Hero";
import MainNav from "@/components/layout/MainNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

// Dynamically import motion components with no SSR
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <MainNav />
      
      <main className="pt-16">
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sustainability-50 to-carbon-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="glass px-4 py-2 text-sm font-medium mb-4 bg-sustainability-100 text-sustainability-800 border-sustainability-200">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                AI-Powered Sustainability
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Your MetaMask Card becomes
                <span className="text-orange-500 "> sustainable</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                ConsizeN&apos;s AI agent automatically analyzes every transaction and makes your spending more eco-friendly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Merchant Analysis",
                  description: "Real-time sustainability scoring of merchants before you spend.",
                  color: "from-purple-400 to-purple-600"
                },
                {
                  icon: TreePine,
                  title: "Auto Carbon Offsets",
                  description: "Automatic purchase of carbon credits to neutralize your impact.",
                  color: "from-green-400 to-green-600"
                },
                {
                  icon: Lightbulb,
                  title: "Smart Spending",
                  description: "AI-powered recommendations for eco-friendly alternatives.",
                  color: "from-blue-400 to-blue-600"
                },
                {
                  icon: Globe,
                  title: "Impact Tracking",
                  description: "Real-time visualization of your environmental impact.",
                  color: "from-indigo-400 to-indigo-600"
                },
                {
                  icon: Users,
                  title: "Community Challenges",
                  description: "Join sustainability challenges with other conscious consumers.",
                  color: "from-pink-400 to-pink-600"
                },
                {
                  icon: ShieldCheck,
                  title: "Zero Effort",
                  description: "Set it and forget it - AI handles everything automatically.",
                  color: "from-amber-400 to-amber-600"
                }
              ].map((feature, index) => (
                <MotionDiv 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="glass-card card-glow group cursor-pointer hover:shadow-xl transition-all duration-300 h-full border-white/30">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        <Separator className="w-full my-10 opacity-20" />

        {/* How It Works Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="glass px-4 py-2 text-sm font-medium mb-4 bg-carbon-100 text-carbon-800 border-carbon-200">
                <Play className="w-4 h-4 mr-2 text-blue-600" />
                How It Works
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Three simple steps to
                <span className="text-orange-500"> sustainable spending</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect your MetaMask Card and let our AI agent do the rest.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {/* Step 1 */}
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                <Card className="glass-card group cursor-pointer relative border-white/30 overflow-hidden h-full flex flex-col">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
                    1
                  </div>
                  <MotionDiv 
                    className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-transparent rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    whileHover={{ opacity: 1 }}
                  />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                      <CreditCard className="h-7 w-7 text-green-500" />
                      Connect Your Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 flex-grow">
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Link your MetaMask Card to ConsizeN with one click. Your data stays secure and private.
                    </p>
                    <div className="space-y-3">
                      {["Secure connection", "Privacy protected", "Instant setup"].map((feature, idx) => (
                        <MotionDiv 
                          key={idx}
                          className="flex items-center gap-3 text-sm text-gray-500 group/item"
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-3 h-3 bg-green-500 rounded-full group-hover/item:shadow-lg group-hover/item:shadow-green-500/30 transition-all"></div>
                          <span className="group-hover/item:text-green-700 transition-colors">{feature}</span>
                        </MotionDiv>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </MotionDiv>

              {/* Step 2 */}
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-full"
              >
                <Card className="glass-card group cursor-pointer relative border-white/30 overflow-hidden h-full flex flex-col">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
                    2
                  </div>
                  <MotionDiv 
                    className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    whileHover={{ opacity: 1 }}
                  />
              <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                      <Brain className="h-7 w-7 text-blue-500" />
                      AI Analyzes Spending
                </CardTitle>
              </CardHeader>
                  <CardContent className="space-y-5 flex-grow">
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Our AI agent analyzes every transaction in real-time, scoring merchants and calculating carbon impact.
                    </p>
                    <div className="space-y-3">
                      {["Real-time analysis", "Merchant scoring", "Carbon tracking"].map((feature, idx) => (
                        <MotionDiv 
                          key={idx}
                          className="flex items-center gap-3 text-sm text-gray-500 group/item"
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-3 h-3 bg-blue-500 rounded-full group-hover/item:shadow-lg group-hover/item:shadow-blue-500/30 transition-all"></div>
                          <span className="group-hover/item:text-blue-700 transition-colors">{feature}</span>
                        </MotionDiv>
                      ))}
                    </div>
              </CardContent>
                </Card>
              </MotionDiv>

              {/* Step 3 */}
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="h-full"
              >
                <Card className="glass-card group cursor-pointer relative border-white/30 overflow-hidden h-full flex flex-col">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
                    3
                  </div>
                  <MotionDiv 
                    className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    whileHover={{ opacity: 1 }}
                  />
              <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                      <TreePine className="h-7 w-7 text-purple-500" />
                      Automatic Impact
                </CardTitle>
              </CardHeader>
                  <CardContent className="space-y-5 flex-grow">
                    <p className="text-lg text-gray-600 leading-relaxed">
                      AI automatically purchases carbon offsets and suggests eco-friendly alternatives for future spending.
                    </p>
                    <div className="space-y-3">
                      {["Auto carbon offsets", "Smart recommendations", "Impact visualization"].map((feature, idx) => (
                        <MotionDiv 
                          key={idx}
                          className="flex items-center gap-3 text-sm text-gray-500 group/item"
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-3 h-3 bg-purple-500 rounded-full group-hover/item:shadow-lg group-hover/item:shadow-purple-500/30 transition-all"></div>
                          <span className="group-hover/item:text-purple-700 transition-colors">{feature}</span>
                        </MotionDiv>
                      ))}
                    </div>
              </CardContent>
                </Card>
              </MotionDiv>
            </div>
          </div>
        </section>

        <Separator className="w-full my-10 opacity-20" />

        {/* Interactive Demo Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sustainability-50 to-carbon-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="glass px-4 py-2 text-sm font-medium mb-4 bg-sustainability-100 text-sustainability-800 border-sustainability-200">
                <FlameKindling className="w-4 h-4 mr-2 text-orange-600" />
                Live Demo
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                See ConsizeN in
                <span className="text-orange-500"> action</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience how our AI agent analyzes transactions and makes real-time sustainability decisions.
              </p>
            </div>

            <Tabs defaultValue="analysis" className="max-w-4xl mx-auto">
              <TabsList className="glass grid w-full grid-cols-3 mb-8 p-1 border border-white/30">
                <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r text-purple-500 data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-4 py-3 rounded-xl transition-all">
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger value="impact" className="data-[state=active]:bg-gradient-to-r text-blue-500 data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white px-4 py-3 rounded-xl transition-all">
                  Impact Tracking
                </TabsTrigger>
                <TabsTrigger value="community" className="data-[state=active]:bg-gradient-to-r text-green-500 data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white px-4 py-3 rounded-xl transition-all">
                  Community
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-6">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass-card card-glow border-white/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shadow-md">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                        Real-Time Merchant Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <p className="text-gray-600">
                        Watch as our AI analyzes a coffee shop transaction in real-time.
                      </p>
                      <div className="space-y-4">
                        <MotionDiv 
                          className="flex items-center justify-between p-4 glass rounded-xl border border-white/20 hover:border-white/40 transition-all"
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <div>
                            <div className="font-medium text-gray-900">Starbucks Coffee</div>
                            <div className="text-sm text-gray-500">$4.50 - Coffee & Pastry</div>
                          </div>
                          <Badge variant="secondary" className="glass bg-purple-100 text-purple-700 px-3 py-1">
                            Score: 65/100
                          </Badge>
                        </MotionDiv>
                        <MotionDiv 
                          className="p-5 glass rounded-xl border border-white/20 hover:border-orange-200 transition-all shadow-sm"
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <div className="text-sm text-gray-600 mb-2 font-medium">AI Analysis:</div>
                          <div className="text-sm text-gray-700 italic leading-relaxed">
                            &ldquo;Starbucks has moderate sustainability practices. Consider local coffee shops for better impact. 
                            Carbon footprint: 0.8kg CO₂. Auto-offset cost: $0.05&rdquo;
                          </div>
                        </MotionDiv>
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              </TabsContent>
              
              <TabsContent value="impact" className="space-y-6">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass-card card-glow border-white/30">
            <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                          <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        Your Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
                      <p className="text-gray-600">
                        Track your sustainability progress and carbon footprint over time.
                      </p>
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Monthly Carbon Footprint</span>
                            <span className="text-blue-600 font-semibold">12.4kg CO₂</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <MotionDiv 
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "65%" }}
                              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Sustainability Score</span>
                            <span className="text-green-600 font-semibold">78%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <MotionDiv 
                              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "78%" }}
                              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            />
                </div>
              </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Carbon Offsets Purchased</span>
                            <span className="text-orange-600 font-semibold">15.2kg CO₂</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <MotionDiv 
                              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "85%" }}
                              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                            />
                          </div>
                </div>
              </div>
            </CardContent>
          </Card>
                </MotionDiv>
              </TabsContent>
              
              <TabsContent value="community" className="space-y-6">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass-card card-glow border-white/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        Community Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <p className="text-gray-600">
                        Join sustainability challenges with other conscious consumers.
                      </p>
                      <div className="space-y-4">
                        <MotionDiv 
                          className="flex items-center justify-between p-4 glass rounded-xl border border-white/20 hover:border-white/40 transition-all"
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <div>
                            <div className="font-medium text-gray-900">30-Day Local Business Challenge</div>
                            <div className="text-sm text-gray-500">1,247 participants</div>
                          </div>
                          <Badge variant="secondary" className="glass bg-green-100 text-green-700 px-3 py-1">
                            Active
                          </Badge>
                        </MotionDiv>
                        <MotionDiv 
                          className="flex items-center justify-between p-4 glass rounded-xl border border-white/20 hover:border-white/40 transition-all"
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <div>
                            <div className="font-medium text-gray-900">Zero-Waste Shopping Challenge</div>
                            <div className="text-sm text-gray-500">892 participants</div>
                          </div>
                          <Badge variant="secondary" className="glass bg-blue-100 text-blue-700 px-3 py-1">
                            Join Now
                          </Badge>
                        </MotionDiv>
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <Separator className="w-full my-10 opacity-20" />

        {/* CTA Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="glass px-4 py-2 text-sm font-medium mb-4 bg-sustainability-100 text-sustainability-800 border-sustainability-200 text-green-600">
              <Award className="w-4 h-4 mr-2 text-green-600" />
              Ready to Make a Difference?
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Join thousands of conscious consumers building a
              <span className="text-orange-500"> sustainable future</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect your MetaMask Card today and let our AI agent make every purchase count for the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="ios-button text-lg px-8 py-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Try Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </MotionDiv>
              <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" className="ios-button-secondary text-lg px-8 py-6 border-green-200 text-green-700 hover:bg-green-50 shadow-sm">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Connect MetaMask Card
                </Button>
              </MotionDiv>
            </div>
      </div>
        </section>
    </main>
    </div>
  );
}
