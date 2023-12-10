'use client'
import {
  Alert,
  AlertIcon,
  Image,
  SimpleGrid,
  Divider,
  CardBody,
  Card,
  Stack,
  Heading,
  CardFooter,
  Button,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { EditModal } from './edit-modal'

export type NftMetadataType = {
  tokenId: bigint
  image: string
  name: string
}

const GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN

const buildPinataUrl = (ipfsHash: string) =>
  `${GATEWAY_URL}/ipfs/${ipfsHash}?pinataGatewayToken=${GATEWAY_TOKEN}`

type NftListProps = {
  nfts: {
    tokenId: string
    tokenUri: string
  }[]
}

export const NftList = ({ nfts }: NftListProps): JSX.Element => {
  const [nftsList, setNftsList] = useState<Array<NftMetadataType>>([])
  const [selectedNft, setSelectedNft] = useState<NftMetadataType>()

  const { address } = useAccount()

  useEffect(() => {
    if (!nfts?.length) {
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
        nfts.map(async ({ tokenId, tokenUri }) => {
          if (tokenUri) {
            const ipfsHash = tokenUri.replace('https://ipfs.io/ipfs/', '')
            const ipfsData = await fetchNftData(ipfsHash)
            const image = buildPinataUrl(
              ipfsData.image.replace('https://ipfs.io/ipfs/', ''),
            )
            return {
              ...ipfsData,
              tokenId,
              image,
            }
          }
        }),
      )

      setNftsList(nftData)
    }

    processTokenUris()
  }, [nfts])

  if (!address) {
    return <></>
  }

  if (!nfts?.length) {
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
    <>
      <Divider my="8" borderColor="gray.400" />
      <SimpleGrid my="6" columns={[1, 1, 2]} gap="6">
        {nftsList.map((nft, id) => {
          return (
            <Card key={id} direction="row" overflow="hidden" variant="outline">
              <Image
                boxSize={[100, 100, 200]}
                objectFit="cover"
                src={nft.image}
                alt={nft.name}
              />
              <Stack>
                <CardBody>
                  <Heading size="md">{nft.name}</Heading>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme="teal"
                    onClick={() => setSelectedNft(nft)}
                  >
                    Edit Name
                  </Button>
                </CardFooter>
              </Stack>
            </Card>
          )
        })}
      </SimpleGrid>
      {selectedNft && (
        <EditModal
          nft={selectedNft}
          isOpen={!!selectedNft}
          onClose={() => setSelectedNft(undefined)}
        />
      )}
    </>
  )
}
