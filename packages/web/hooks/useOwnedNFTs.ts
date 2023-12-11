import { erc721ABI, useAccount, useContractRead, useContractReads } from 'wagmi'
import { useIsMounted } from './useIsMounted'
import { abi as AcmeNFTAbi } from 'contracts/artifacts/contracts/AcmeNFT.sol/AcmeNFT.abi'
import { useMemo } from 'react'
import { useContracts } from './useContracts'

export const useOwnedNFTs = () => {
  const { address } = useAccount()

  const { isMounted } = useIsMounted()
  const { NFT_CONTRACT_ADDRESS } = useContracts()

  const {
    data: nftBalanceData,
    refetch: refetchNftBalanceData,
    isLoading: fetchLoading,
  } = useContractRead({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: erc721ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: isMounted && !!address && !!NFT_CONTRACT_ADDRESS,
  })

  const contracts = useMemo(() => {
    const calls = []

    if (nftBalanceData) {
      const nftBalance = Number(nftBalanceData)
      for (let i = 0; i < nftBalance; i++) {
        calls.push({
          address: NFT_CONTRACT_ADDRESS,
          abi: AcmeNFTAbi,
          functionName: 'getTokenByIndex',
          args: [address, i],
        })
      }
    }

    return calls
  }, [address, nftBalanceData, NFT_CONTRACT_ADDRESS])

  // Gets all of the NFT tokenIds owned by the connected address.
  const { data: nftTokenIds, isLoading: idsLoading } = useContractReads({
    contracts: contracts as any,
    enabled: isMounted && contracts.length > 0,
  })

  // Creates the contracts array for `nftTokenUris`
  const tokenUriContractsArray = useMemo(() => {
    if (!nftTokenIds || nftTokenIds.length === 0) {
      return []
    }

    const contractCalls = nftTokenIds?.map(({ result }) => {
      const tokenId = Number(result)?.toString()
      return {
        tokenId,
        contract: {
          address: NFT_CONTRACT_ADDRESS,
          abi: AcmeNFTAbi,
          functionName: 'tokenURI',
          args: tokenId ? [tokenId] : undefined,
        },
      }
    })

    return contractCalls
  }, [NFT_CONTRACT_ADDRESS, nftTokenIds])

  // Gets all of the NFT tokenUris owned by the connected address.
  const { data: nftTokenUris, isLoading: urisLoading } = useContractReads({
    contracts: tokenUriContractsArray.map(({ contract }) => contract) as any,
    enabled: tokenUriContractsArray.length > 0,
  })

  const nfts = tokenUriContractsArray.flatMap(({ tokenId }, index) =>
    nftTokenUris?.[index]?.result
      ? [
          {
            tokenId,
            tokenUri: nftTokenUris[index].result as string,
          },
        ]
      : [],
  )

  return {
    nfts,
    refetchNftBalanceData,
    loading: fetchLoading || idsLoading || urisLoading,
  }
}
