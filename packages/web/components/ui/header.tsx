'use client'

import { Container, Flex, Link, SimpleGrid } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'

export const Header = () => (
  <header>
    <Container maxWidth="container.xl">
      <SimpleGrid
        columns={[1, 1, 1, 2]}
        alignItems="center"
        justifyContent="space-between"
        py="8"
      >
        <Flex py={[4, null, null, 0]}>
          <NextLink href="/" passHref legacyBehavior>
            <Link px="4" py="1">
              Home
            </Link>
          </NextLink>
          <NextLink href="/mint" passHref legacyBehavior>
            <Link px="4" py="1">
              Mint NFT
            </Link>
          </NextLink>
        </Flex>
        <Flex
          order={[-1, null, null, 2]}
          alignItems={'center'}
          justifyContent={['flex-start', null, null, 'flex-end']}
        >
          <ConnectButton />
        </Flex>
      </SimpleGrid>
    </Container>
  </header>
)
