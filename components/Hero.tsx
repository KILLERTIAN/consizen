"use client";

import Image from "next/image";
import dynamic from 'next/dynamic';
import { 
  ArrowRight, 
  Leaf, 
  Brain, 
  Play,
  Sparkles,
  CreditCard,
  Award,
  Heart,
  Zap,
  TreePine,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import motion components with no SSR
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

export function Hero() {
    return (
    <div className="relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-sustainability-50 via-white to-carbon-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating sustainability elements - More colorful icons */}
        <MotionDiv
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-[5%] md:left-20 w-16 h-16 text-green-500 opacity-70"
        >
          <TreePine className="w-full h-full drop-shadow-lg" />
        </MotionDiv>

        <MotionDiv
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-20 right-[5%] md:right-32 w-14 h-14 text-blue-500 opacity-70"
        >
          <Target className="w-full h-full drop-shadow-lg" />
        </MotionDiv>

        <MotionDiv
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-40 right-[15%] md:right-40 w-14 h-14 text-orange-500 opacity-70"
        >
          <CreditCard className="w-full h-full drop-shadow-lg" />
        </MotionDiv>

        <MotionDiv
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-[35%] left-[50%] w-12 h-12 text-purple-500 opacity-70"
        >
          <Sparkles className="w-full h-full drop-shadow-lg" />
        </MotionDiv>

        <MotionDiv
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-[20%] left-[4%] w-12 h-12 text-pink-500 opacity-70"
        >
          <Heart className="w-full h-full drop-shadow-lg" />
        </MotionDiv>

        <MotionDiv
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-green-300 to-green-500 rounded-full blur-xl"
        />

        <MotionDiv
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full blur-xl"
        />

        <MotionDiv
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            {/* <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="secondary" className="glass px-4 py-2 text-sm font-medium bg-sustainability-100 text-sustainability-800 border-sustainability-200 shadow-md">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                AI-Powered Sustainability Agent
              </Badge>
            </MotionDiv> */}

            {/* Main Title */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
            >

              <br />
              <span className="text-gray-800">Your Conscious</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
                MetaMask Card
              </span>
            </MotionDiv>

            {/* Subtitle */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl sm:text-2xl text-gray-600 leading-relaxed"
            >
              The AI-powered sustainability agent that automatically makes your MetaMask Card spending more eco-friendly. 
              <span className="font-semibold text-sustainability-600"> Zero effort, maximum impact.</span>
            </MotionDiv>

            {/* Key Features */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {[
                { icon: Brain, text: "AI Merchant Analysis", color: "from-purple-400 to-purple-600", iconColor: "text-white" },
                { icon: Leaf, text: "Auto Carbon Offsets", color: "from-green-400 to-green-600", iconColor: "text-white" },
                { icon: Zap, text: "Smart Spending", color: "from-blue-400 to-blue-600", iconColor: "text-white" },
                { icon: Award, text: "Community Impact", color: "from-pink-400 to-pink-600", iconColor: "text-white" }
              ].map((feature, index) => (
                <MotionDiv
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  className="flex items-center gap-3 text-gray-700 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <span className="font-medium text-base sm:text-lg">{feature.text}</span>
                </MotionDiv>
              ))}
            </MotionDiv>

            {/* CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="ios-button text-lg px-8 py-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg transform hover:scale-105 transition-transform duration-300 text-white"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                className="ios-button-secondary text-lg px-8 py-6 text-orange-700 bg-white/30 backdrop-blur-lg border border-orange-200 shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Connect Card
              </Button>
            </MotionDiv>
          </MotionDiv>

          {/* Right Content - MetaMask Card Showcase */}
          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative lg:min-h-[500px] flex items-center justify-center lg:justify-end"
          >
            {/* Card holder (person) image - positioned to appear holding the card */}
            <div className="absolute top-1/2 transform -translate-y-1/2 right-0 lg:translate-x-[40%] h-[90%] max-h-[550px] opacity-90 z-0 hidden md:block">
              <Image 
                src="/card-image.png" 
                alt="Card Holder" 
                width={450}
                height={800}
                className="h-full w-auto object-contain drop-shadow-2xl"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  // Fallback for missing image
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Card Glow Effect - amplify the glow for better visibility */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-r from-orange-400/30 to-orange-600/30 filter blur-2xl opacity-80 -z-10 animate-pulse"></div>
          </MotionDiv>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-current"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-current"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-current"
          />
        </svg>
      </div>
    </div>
  );
}
