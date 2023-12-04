'use client'

import * as React from 'react'
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, localhost, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { ChakraProvider } from '@chakra-ui/react'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [sepolia, localhost]
      : []),
  ],
  [
    publicProvider(),
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || '',
    }),
  ],
)

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const { wallets } = getDefaultWallets({
  appName: 'ACME Collection',
  projectId,
  chains,
})

const appInfo = {
  appName: 'ACME Collection',
}

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={appInfo}
        theme={darkTheme({
          borderRadius: 'medium',
        })}
      >
        <ChakraProvider>{mounted && children}</ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
