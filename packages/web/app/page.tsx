import {
  Button,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Heading as="h1" mb="8">
        Web3 Acme Collection
      </Heading>
      <Text fontSize="lg" mb="4">
        Demo NFT collection made with:
      </Text>
      <UnorderedList mb="8">
        <ListItem>
          <Link href="https://hardhat.org/" color="teal.500" isExternal>
            Hardhat
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://nextjs.org/" color="teal.500" isExternal>
            Next.js 13 (App Router + Api Routes)
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://nestjs.com/" color="teal.500" isExternal>
            Nest.js
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://www.rainbowkit.com/" color="teal.500" isExternal>
            RainbowKit
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://wagmi.sh/" color="teal.500" isExternal>
            wagmi Hooks
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://chakra-ui.com" color="teal.500" isExternal>
            Chakra UI
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://www.pinata.cloud" color="teal.500" isExternal>
            Pinata
          </Link>
        </ListItem>
      </UnorderedList>
      <Button
        as="a"
        size="lg"
        colorScheme="teal"
        variant="outline"
        href="https://github.com/thatsimo/web3-acme-collection"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get the source code!
      </Button>

      <Text mt="8" fontSize="xl">
        This page only works on the SEPOLIA Testnet or on a Local Chain.
      </Text>
    </>
  )
}

export default Home
