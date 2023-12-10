'use client'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Code,
  Heading,
  Link,
  Text,
  Spacer,
  useToast,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useIsMounted } from '../../hooks/useIsMounted'
import { NftList } from '../../components/ui/nft-list'
import { useOwnedNFTs } from '../../hooks/useOwnedNFTs'
import { UploadModal } from '../../components/ui/upload-modal'
import { useContracts } from '../../hooks/useContracts'
import { useJoin } from '../../hooks/useJoin'
import { useUploadAndMintNFT } from '../../hooks/useUploadAndMintNFT'

const NftIndex: NextPage = () => {
  const { nfts, refetchNftBalanceData } = useOwnedNFTs()
  const { isMounted } = useIsMounted()
  const { address, isConnected } = useAccount()
  const toast = useToast()
  const { MEMBER_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } = useContracts()

  const { join, hasMintPerm, isLoading } = useJoin({
    onJoinSuccess(data) {
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Successfully minted your NFT!</Text>
            <Text>
              <Link
                href={`https://sepolia.etherscan.io/tx/${data?.transactionHash}`}
                isExternal
              >
                View on Etherscan
              </Link>
            </Text>
          </>
        ),
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onJoinError(error) {
      toast({
        title: 'Failed to mint your NFT!',
        description: <Text>{error?.error?.reason || 'Try later'}</Text>,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const { uploadAndMint, loading } = useUploadAndMintNFT({
    onMintSuccess: (data) => {
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Successfully minted your NFT!</Text>
            <Text>
              <Link
                href={`https://sepolia.etherscan.io/tx/${data?.transactionHash}`}
                isExternal
              >
                View on Etherscan
              </Link>
            </Text>
          </>
        ),
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      refetchNftBalanceData()
      setModalIsOpen(false)
    },
    onMintError: (error) => {
      toast({
        title: 'Failed to mint your NFT!',
        description: <Text>{error || 'Try later'}</Text>,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const [modalIsOpen, setModalIsOpen] = useState(false)

  if (!isMounted) {
    return null
  }

  const getAlert = () => {
    if (!hasMintPerm) {
      return (
        <Alert status="warning" mb="4">
          <AlertIcon />
          <AlertTitle>Access Denied:</AlertTitle>
          <AlertDescription>You are not a member.</AlertDescription>
        </Alert>
      )
    }

    if (!isConnected) {
      return (
        <Alert status="warning" mb="4">
          <AlertIcon />
          <AlertTitle>Access Denied:</AlertTitle>
          <AlertDescription>Please Connect a wallet</AlertDescription>
        </Alert>
      )
    }

    return (
      <Alert status="success" mb="4">
        <AlertIcon />
        <AlertTitle>You can mint NFTs:</AlertTitle>
        <AlertDescription>
          Authenticated as <Code>{address}</Code>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <Heading as="h1" mb="8">
        Mint NFT
      </Heading>
      <Text mb="2" fontSize="xl">
        This page will check your authenticated user&apos;s address for{' '}
        <Link
          href={`https://sepolia.etherscan.io/token/${MEMBER_CONTRACT_ADDRESS}`}
          color="teal.500"
          isExternal
        >
          AcmeMemberNFT (ACMEm)
        </Link>{' '}
        on the SEPOLIA Testnet or Local network.
      </Text>
      <Text mb="6" fontSize="xl">
        Only members can mint NFTs. You can join as member by{' '}
        <Button
          color="teal.500"
          variant="link"
          onClick={join}
          size="xl"
          fontWeight="medium"
          isDisabled={isLoading}
        >
          Minting the AcmeMemberNFT
        </Button>
        {isLoading && <Spinner ml={4} size="sm" color="teal.500" />}
      </Text>
      {getAlert()}
      <Box p="8" mt="8" bg="gray.100">
        <Flex>
          <Box>
            <Text fontSize="lg" textAlign="start">
              AcmeMemberNFT Contract Address:{' '}
              <Code fontSize="md">{MEMBER_CONTRACT_ADDRESS}</Code>
            </Text>
            <Text fontSize="lg" textAlign="start">
              AcmeNFT Contract Address:{' '}
              <Code fontSize="md">{NFT_CONTRACT_ADDRESS}</Code>
            </Text>
          </Box>
          <Spacer />
          <Button
            colorScheme="teal"
            size="lg"
            isDisabled={!hasMintPerm || !isConnected}
            onClick={() => setModalIsOpen(true)}
          >
            {isConnected ? 'Mint NFT' : 'Please Connect Wallet'}
          </Button>
        </Flex>
        <NftList nfts={nfts} />
      </Box>
      <UploadModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        uploadAndMint={uploadAndMint}
        loading={loading}
      />
    </>
  )
}

export default NftIndex
