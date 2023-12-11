import { use, useEffect, useState } from 'react'
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useContracts } from './useContracts'
import { useIsMounted } from './useIsMounted'
import { parseEther } from 'viem'
import { customNameCost } from '../consts/costs'

const IPFS_BASE_URL = 'https://ipfs.io/ipfs'

type UseCustomNameProps = {
  onTxSuccess?: (data?: any) => void
  onTxError?: (data?: any) => void
}

export const useCustomName = ({
  onTxSuccess,
  onTxError,
}: UseCustomNameProps) => {
  const [loading, setLoading] = useState(false)
  const [customName, setCustomName] = useState('')
  const [tokenId, setTokenId] = useState<bigint>()
  const { isMounted } = useIsMounted()

  const { AcmeNFTAbi, NFT_CONTRACT_ADDRESS } = useContracts()

  const { config } = usePrepareContractWrite({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: AcmeNFTAbi,
    functionName: 'purchaseCustomName',
    args: tokenId && customName ? [tokenId, customName] : undefined,
    value: customNameCost.value,
    enabled: !!customName && !!NFT_CONTRACT_ADDRESS && isMounted,
  })

  const { data, write, error } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setCustomName('')
      setLoading(false)
      onTxSuccess?.(data)
    },
    onError: (error) => {
      setCustomName('')
      setLoading(false)
      onTxError?.(error)
    },
  })

  useEffect(() => {
    if (error) {
      console.log(error.message)
      setCustomName('')
      setLoading(false)
      onTxError?.(error.message.split('\n')[0])
    }
  }, [error])

  const editCustomName = async (tokenId: bigint, newName: string) => {
    setTokenId(tokenId)
    setCustomName(newName)
  }

  useEffect(() => {
    if (tokenId && customName && write) {
      write()
      setCustomName('')
      setTokenId(undefined)
    }
  }, [customName, tokenId, write])

  return { editCustomName, loading: loading || isLoading }
}
