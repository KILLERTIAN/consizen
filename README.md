# ConsizeN - AI-Powered Sustainable Spending Agent

🎯 **The AI-Powered Sustainability Agent for Your MetaMask Card**

ConsizeN is an intelligent AI agent that automatically makes your MetaMask Card spending more sustainable through real-time merchant analysis, autonomous carbon offset purchases, and smart eco-friendly recommendations.

## 🌟 Features

- **🤖 AI Merchant Analysis** - Real-time sustainability scoring of merchants
- **🌱 Auto Carbon Offsets** - Automatic purchase of carbon credits
- **📊 Smart Spending** - AI-powered eco-friendly recommendations
- **🎯 Impact Tracking** - Real-time environmental impact visualization
- **👥 Community Challenges** - Join sustainability challenges with other users
- **⚡ Zero Effort** - Set it and forget it - AI handles everything

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3.4+ with custom glassmorphism effects
- **UI Components**: Shadcn/ui with custom sustainability theme
- **Animations**: Framer Motion for smooth, iOS-style animations
- **AI**: Google Gemini AI for sustainability analysis
- **Blockchain**: MetaMask SDK, Wagmi, Viem
- **State Management**: React Context + TanStack Query

## 🚀 Quick Start

### Prerequisites

- Node.js 19+ 
- MetaMask browser extension or mobile app
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd consizen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini AI API Key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   
   # MetaMask SDK Configuration
   NEXT_PUBLIC_METAMASK_DAPP_NAME=ConsizeN
   NEXT_PUBLIC_METAMASK_DAPP_URL=https://consizen.app
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette

- **Sustainability Green**: `#22c55e` to `#15803d`
- **Carbon Yellow**: `#eab308` to `#a16207`
- **MetaMask Orange**: `#f7931a` to `#ff6b35`
- **Glassmorphism**: White with transparency and blur effects

### Key Components

- **Glass Cards**: Translucent cards with backdrop blur
- **iOS-style Buttons**: Rounded buttons with gradient backgrounds
- **Animated Elements**: Smooth transitions and floating animations
- **MetaMask Card**: Interactive card showcase with real-time data

## 🧠 AI Features

### Sustainability Analysis

The Gemini AI analyzes merchants based on:
- Environmental impact
- Social responsibility
- Sustainable practices
- Carbon footprint
- Certifications and standards

### Carbon Footprint Calculation

Real-time calculation of:
- CO₂ emissions per transaction
- Offset costs
- Environmental impact levels
- Category-specific analysis

### Smart Recommendations

AI-powered suggestions for:
- Eco-friendly alternatives
- Sustainable spending habits
- Carbon reduction strategies
- Community impact opportunities

## 📱 MetaMask Card Integration

### Features

- **Real-time Connection**: Secure wallet connection
- **Transaction Analysis**: Automatic sustainability scoring
- **Carbon Tracking**: Live CO₂ impact monitoring
- **Auto Offsets**: Automatic carbon credit purchases
- **Smart Routing**: Optimized USDC transactions

### Demo Flow

1. **Connect Card**: One-click MetaMask Card connection
2. **AI Analysis**: Real-time merchant sustainability scoring
3. **Impact Tracking**: Live carbon footprint visualization
4. **Auto Offsets**: Automatic carbon credit purchases
5. **Community**: Join sustainability challenges

## 🏗 Project Structure

```
consizen/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with glassmorphism
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main landing page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── Hero.tsx          # Animated hero section
│   └── navbar.tsx        # Navigation with wallet connection
├── lib/                  # Utility functions
│   ├── gemini.ts         # Gemini AI integration
│   └── utils.ts          # Helper functions
├── wagmi.config.ts       # Wagmi configuration
└── tailwind.config.ts    # Tailwind with custom theme
```

## 🎯 Hackathon Features

### Required Integrations

- ✅ **MetaMask SDK** - Card connectivity and user interaction
- ✅ **Google Gemini AI** - Agent intelligence and analysis
- 🔄 **Circle Wallets SDK** - Core wallet functionality (planned)
- 🔄 **LI.FI SDK** - Cross-chain USDC operations (planned)

### Demo Script

1. **Hook**: "Meet ConsizeN - your AI sustainability agent"
2. **Problem**: "Managing eco-friendly spending is complex"
3. **Solution**: "ConsizeN's AI makes every purchase sustainable"
4. **Demo**: 
   - Show AI analyzing merchant in real-time
   - Demonstrate autonomous carbon offsetting
   - Display community impact aggregation
5. **Impact**: "Real users, real sustainability, real automation"

## 🔧 Development

### Available Scripts

   ```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Customization

- **Colors**: Update `tailwind.config.ts` for new color schemes
- **Animations**: Modify `globals.css` for custom animations
- **AI Prompts**: Edit `lib/gemini.ts` for different analysis criteria
- **Components**: Add new components in `components/` directory

## 🌍 Sustainability Impact

### Metrics Tracked

- **Carbon Footprint**: CO₂ emissions per transaction
- **Sustainability Score**: Merchant eco-friendliness (1-100)
- **Offset Impact**: Carbon credits purchased
- **Community Impact**: Collective environmental benefit

### Community Features

- **Challenges**: Monthly sustainability challenges
- **Leaderboards**: Community impact rankings
- **Recommendations**: AI-powered eco-friendly suggestions
- **Impact Visualization**: Real-time environmental impact tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MetaMask** for the Card SDK and developer tools
- **Google** for the Gemini AI platform
- **Circle** for Web3 infrastructure
- **LI.FI** for cross-chain solutions
- **Shadcn/ui** for beautiful components
- **Framer Motion** for smooth animations

---

**Built with ❤️ for a sustainable future**

*ConsizeN - Making every purchase count for the planet*
