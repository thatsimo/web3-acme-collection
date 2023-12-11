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
  useToast,
  Text,
  Link,
  Button,
  Center,
  Spinner,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { EditModal } from './edit-modal'
import { useCustomName } from '../../hooks/useCustomName'

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
  loading?: boolean
  refetchNftBalanceData: () => void
}

export const NftList = ({
  nfts,
  loading,
  refetchNftBalanceData,
}: NftListProps): JSX.Element => {
  const [nftsList, setNftsList] = useState<Array<NftMetadataType>>([])
  const [selectedNft, setSelectedNft] = useState<NftMetadataType>()

  const { address } = useAccount()

  const toast = useToast()

  const { editCustomName, loading: editLoading } = useCustomName({
    onTxSuccess: (data) => {
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
      setSelectedNft(undefined)
    },
    onTxError: (error) => {
      toast({
        title: 'Failed to mint your NFT!',
        description: <Text>{error || 'Try later'}</Text>,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

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

  if (loading) {
    return (
      <>
        <Divider my="8" borderColor="gray.400" />
        <Center>
          <Spinner />
        </Center>
      </>
    )
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
          loading={editLoading}
          editCustomName={editCustomName}
          onClose={() => setSelectedNft(undefined)}
        />
      )}
    </>
  )
}
