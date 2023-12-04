import { useEffect, useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useContracts } from './useContracts'
import { useIsMounted } from './useIsMounted'
import { use } from 'chai'
import { on } from 'events'

type UseJoinProps = {
  onJoinSuccess?: (data: any) => void
  onJoinError?: (data: any) => void
}

export const useJoin = ({ onJoinSuccess, onJoinError }: UseJoinProps) => {
  const [hasMintPerm, setHasMintPerm] = useState(false)
  const { isMounted } = useIsMounted()

  const { address } = useAccount()

  const { AcmeMemberNFTAbi, MEMBER_CONTRACT_ADDRESS } = useContracts()

  const {
    data: numberOfNfts,
    isLoading: isNumberOfNftsLoading,
    error: isNumberOfNftsError,
    refetch: refetchNumberOfNfts,
  } = useContractRead({
    address: MEMBER_CONTRACT_ADDRESS as `0x${string}`,
    abi: AcmeMemberNFTAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: address && !!MEMBER_CONTRACT_ADDRESS && isMounted,
  })

  useEffect(() => {
    if (!isNumberOfNftsLoading && numberOfNfts) {
      setHasMintPerm(numberOfNfts > 0)
    }
  }, [numberOfNfts, isNumberOfNftsLoading])

  useEffect(() => {
    if (isNumberOfNftsError) {
      onJoinError?.('There was an error trying to fetch your NFT.')
    }
  }, [isNumberOfNftsError, onJoinError])

  const { config } = usePrepareContractWrite({
    address: MEMBER_CONTRACT_ADDRESS as `0x${string}`,
    abi: AcmeMemberNFTAbi,
    functionName: 'safeMint',
    args: address ? [address] : undefined,
    enabled: address && !hasMintPerm && !!MEMBER_CONTRACT_ADDRESS && isMounted,
  })

  const { data, write } = useContractWrite(config)

  const join = () => {
    if (!write) {
      return
    }

    if (hasMintPerm) {
      onJoinError?.("You've already joined!")
      return
    }

    write()
  }

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      onJoinSuccess?.(data)
      refetchNumberOfNfts()
    },
  })

  return { isLoading: isLoading || isNumberOfNftsLoading, hasMintPerm, join }
}
