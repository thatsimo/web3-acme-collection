import { use, useEffect, useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useContracts } from './useContracts'
import { useIsMounted } from './useIsMounted'
import axios from 'axios'
import { on } from 'events'

type UseJoinProps = {
  onJoinSuccess?: (data: any) => void
  onJoinError?: (data: any) => void
}

export const useJoin = ({ onJoinSuccess, onJoinError }: UseJoinProps) => {
  const [hasMintPerm, setHasMintPerm] = useState(false)
  const [isLoading, setLoading] = useState(false)
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
    if (!isNumberOfNftsLoading) {
      if (!numberOfNfts) {
        setHasMintPerm(false)
      } else {
        setHasMintPerm(numberOfNfts > 0)
      }
    }
  }, [numberOfNfts, isNumberOfNftsLoading])

  useEffect(() => {
    if (isNumberOfNftsError) {
      onJoinError?.('There was an error trying to fetch your NFT.')
    }
  }, [isNumberOfNftsError, onJoinError])

  const join = () => {
    setLoading(true)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_ACME_NFT_API}/api/acme-member-nft-contract/mint`,
        {
          to: address,
        },
      )
      .then(({ data }) => {
        console.log(data)
        onJoinSuccess?.(data)
        refetchNumberOfNfts()
      })
      .catch(({ response }) => {
        onJoinError?.(response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { isLoading: isLoading || isNumberOfNftsLoading, hasMintPerm, join }
}
