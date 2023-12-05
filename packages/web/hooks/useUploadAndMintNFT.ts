import { use, useEffect, useState } from 'react'
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useContracts } from './useContracts'
import { useIsMounted } from './useIsMounted'

const IPFS_BASE_URL = 'https://ipfs.io/ipfs'

type UseUploadAndMintNFTProps = {
  onMintSuccess?: (data?: any) => void
  onMintError?: (data?: any) => void
}

export const useUploadAndMintNFT = ({
  onMintSuccess,
  onMintError,
}: UseUploadAndMintNFTProps) => {
  const [loading, setLoading] = useState(false)
  const [nftUri, setNftUri] = useState('')
  const [hasMinted, setHasMinted] = useState(false)
  const [customName, setCustomName] = useState('')
  const { isMounted } = useIsMounted()

  const { AcmeNFTAbi, NFT_CONTRACT_ADDRESS } = useContracts()
  const { address } = useAccount()

  const { config } = usePrepareContractWrite({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: AcmeNFTAbi,
    functionName: 'safeMint',
    args: address ? [address, nftUri, customName] : undefined,
    enabled: address && !!nftUri && !!NFT_CONTRACT_ADDRESS && isMounted,
  })

  const { data, write, error } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setNftUri('')
      setLoading(false)
      onMintSuccess?.(data)
    },
    onError: (error) => {
      setNftUri('')
      setLoading(false)
      onMintError?.(error)
    },
  })

  useEffect(() => {
    if (error) {
      console.log(error.message)
      setNftUri('')
      setLoading(false)
      onMintError?.(error.message.split('\n')[0])
    }
  }, [error])

  const uploadAndMint = async (fileToUpload: File, customName?: string) => {
    try {
      setLoading(true)

      if (customName) {
        setCustomName(customName)
      }

      const formData = new FormData()
      formData.append('file', fileToUpload, fileToUpload.name)
      const res = await fetch('/api/ipfs/file', {
        method: 'POST',
        body: formData,
      })

      const ipfsHash = await res.json()

      const metaCID = await fetch('api/ipfs/json', {
        method: 'POST',
        body: JSON.stringify({
          name: customName || 'ACME Product',
          image: `${IPFS_BASE_URL}/${ipfsHash}`,
        }),
      })

      const metaCIDJson = await metaCID.json()

      setNftUri(`${IPFS_BASE_URL}/${metaCIDJson}`)
      setHasMinted(true)
    } catch (e) {
      console.log(e)
      setLoading(false)
      alert('Trouble uploading file')
    }
  }

  useEffect(() => {
    if (hasMinted && write) {
      write()
      setHasMinted(false)
    }
  }, [hasMinted, write])

  return { uploadAndMint, nftUri, loading: loading || isLoading }
}
