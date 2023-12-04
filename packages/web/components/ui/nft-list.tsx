'use client'
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Divider,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

type NftMetadataType = {
  description: string
  image: string
  name: string
}

const GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN

const buildPinataUrl = (ipfsHash: string) =>
  `${GATEWAY_URL}/ipfs/${ipfsHash}?pinataGatewayToken=${GATEWAY_TOKEN}`

type NftListProps = {
  nftTokenUris?: Array<any>
}

export const NftList = ({ nftTokenUris }: NftListProps): JSX.Element => {
  const [nfts, setNfts] = useState<Array<NftMetadataType>>([])

  const { address } = useAccount()

  useEffect(() => {
    if (!nftTokenUris?.length) {
      return
    }
    const fetchNftData = async (ipfsHash: string) => {
      try {
        const resp = await fetch(buildPinataUrl(ipfsHash))

        return await resp.json()
      } catch (error) {
        console.log('error', error)
      }
    }

    const processTokenUris = async () => {
      const nftData = await Promise.all(
        nftTokenUris.map(async ({ result }) => {
          const tokenUri = result as string
          if (tokenUri) {
            const ipfsHash = tokenUri.replace('https://ipfs.io/ipfs/', '')
            const ipfsData = await fetchNftData(ipfsHash)
            const image = buildPinataUrl(
              ipfsData.image.replace('https://ipfs.io/ipfs/', ''),
            )
            return {
              ...ipfsData,
              image,
            }
          }
        }),
      )

      setNfts(nftData)
    }

    processTokenUris()
  }, [nftTokenUris])

  if (!address) {
    return <></>
  }

  if (!nftTokenUris?.length) {
    return (
      <>
        {' '}
        <Divider my="8" borderColor="gray.400" />
        <Alert status="warning">
          <AlertIcon />
          No NFTs associated with your address: {address}
        </Alert>
      </>
    )
  }

  return (
    <div>
      <Divider my="8" borderColor="gray.400" />
      <SimpleGrid my="6" columns={[1, 1, 2]} gap="6">
        {nfts.map((nft, id) => {
          return (
            <Flex
              key={id}
              p="4"
              gap="4"
              alignItems="center"
              backgroundColor="white"
              border="1px"
              borderColor="gray.300"
            >
              <Image
                boxSize={[100, 100, 200]}
                objectFit="cover"
                src={nft.image}
                alt={nft.name}
              />
              <Box>
                <Text fontSize="lg" fontWeight="semibold">
                  {nft.name}
                </Text>
              </Box>
            </Flex>
          )
        })}
      </SimpleGrid>
    </div>
  )
}
