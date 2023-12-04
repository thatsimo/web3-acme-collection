import {
  AcmeMemberNFT as MEMBER_NFT_LOCAL_ADDRESS,
  AcmeNFT as NFT_LOCAL_ADDRESS,
} from 'contracts/artifacts/contracts/contractAddress'
import { abi as AcmeMemberNFTAbi } from 'contracts/artifacts/contracts/AcmeMemberNFT.sol/AcmeMemberNFT.abi'
import { abi as AcmeNFTAbi } from 'contracts/artifacts/contracts/AcmeNFT.sol/AcmeNFT.abi'
import { useNetwork } from 'wagmi'
import { useMemo } from 'react'
import { localhost, sepolia } from 'viem/chains'

const MEMBER_NFT_SEPOLIA_ADDRESS = '0x89C4dB33E5433a705487b3C70410b328404f3DF9'
const NFT_SEPOLIA_ADDRESS = '0x6f8167321Dcb00a577a76ACFFDA9AC7fA492BC88'

export const useContracts = () => {
  const { chain } = useNetwork()

  const { MEMBER_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } = useMemo(() => {
    if (chain && chain.id === localhost.id) {
      return {
        MEMBER_CONTRACT_ADDRESS: MEMBER_NFT_LOCAL_ADDRESS,
        NFT_CONTRACT_ADDRESS: NFT_LOCAL_ADDRESS,
      }
    }
    if (chain && chain.id == sepolia.id) {
      return {
        MEMBER_CONTRACT_ADDRESS: MEMBER_NFT_SEPOLIA_ADDRESS,
        NFT_CONTRACT_ADDRESS: NFT_SEPOLIA_ADDRESS,
      }
    }
    return { MEMBER_CONTRACT_ADDRESS: '', NFT_CONTRACT_ADDRESS: '' }
  }, [chain])

  return {
    MEMBER_CONTRACT_ADDRESS,
    NFT_CONTRACT_ADDRESS,
    AcmeMemberNFTAbi,
    AcmeNFTAbi,
  }
}
