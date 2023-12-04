'use client'
import '@rainbow-me/rainbowkit/styles.css'
import { Container } from '@chakra-ui/react'

import React, { PropsWithChildren } from 'react'

import { Providers } from './providers'
import { Header } from '../components/ui/header'

const metadata = {
  title: 'ACME Collection',
  description: 'Demo NFT collection for ACME',
}

export default function RootLayout({
  children,
}: PropsWithChildren): JSX.Element {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Providers>
          <Header />
          <main>
            <Container maxWidth="container.xl">{children}</Container>
          </main>
        </Providers>
      </body>
    </html>
  )
}
