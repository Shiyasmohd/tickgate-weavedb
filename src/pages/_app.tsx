import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Metadata } from "next"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { alchemyProvider } from 'wagmi/providers/alchemy';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/toaster"

export default function App({ Component, pageProps }: AppProps) {

  interface RootLayoutProps {
    children: React.ReactNode
  }

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
      mainnet,
      polygon,
      optimism,
      arbitrum,
    ],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: 'RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
      <ThemeProvider attribute="class" defaultTheme="light" >
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <NextTopLoader color="#000" showSpinner={false} />
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <Toaster />
              <div className="flex-1">
                <Component {...pageProps} />
              </div>
            </div>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </div>
  )
}
