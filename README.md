# ConsizeN - AI-Powered Sustainable Spending for MetaMask Card

ConsizeN is a Next.js application that brings sustainability to your MetaMask Card spending through AI-powered analysis and automated carbon offsetting.

## Features

- **AI Merchant Analysis**: Real-time sustainability scoring of merchants before you spend
- **Auto Carbon Offsets**: Automatic purchase of carbon credits to neutralize your impact
- **Smart Spending**: AI-powered recommendations for eco-friendly alternatives
- **Impact Tracking**: Real-time visualization of your environmental impact
- **AutoTop Agent**: AI-powered cross-chain USDC management for your MetaMask Card

## Hackathon Implementation

This project implements the following technologies for the MetaMask hackathon:

1. **MetaMask SDK Integration**: Connect to MetaMask wallet and interact with the blockchain
2. **Circle Wallets**: Create and manage programmable wallets for users
3. **LI.FI SDK**: Cross-chain transfers using Circle CCTP V2 protocol

## Key Components

- **AutoTop Agent**: Monitors gas prices and automatically tops up your MetaMask Card with USDC when prices are optimal
- **Circle Wallet Integration**: Create and manage Circle wallets for cross-chain USDC transfers
- **MetaMask Card Linking**: Connect your MetaMask Card to track and improve your sustainability metrics

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/consizen.git
cd consizen
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```
# Circle API Keys
CIRCLE_API_KEY=YOUR_CIRCLE_API_KEY
CIRCLE_API_URL=https://api-sandbox.circle.com

# LI.FI API Keys
LIFI_API_KEY=YOUR_LIFI_API_KEY
LIFI_API_URL=https://li.quest/v1

# MetaMask SDK Keys
METAMASK_SDK_KEY=YOUR_METAMASK_SDK_KEY

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/`: Next.js app router pages and API routes
- `components/`: React components
  - `wallet/`: Wallet-related components (AutoTop Agent, Card Linking, etc.)
  - `ui/`: Shadcn UI components
- `lib/`: Utility functions and API integrations
  - `api/`: API integration with Circle, LI.FI, etc.
  - `hooks/`: React hooks for wallet functionality

## Technologies Used

- **Next.js**: React framework for building the UI
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: UI component library
- **MetaMask SDK**: For wallet connection
- **Circle API**: For programmable wallets and USDC transfers
- **LI.FI SDK**: For cross-chain transfers
- **Framer Motion**: For animations

## License

MIT
