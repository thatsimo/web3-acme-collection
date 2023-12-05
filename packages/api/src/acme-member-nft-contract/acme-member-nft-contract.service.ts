import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AcmeMemberNFT__factory,
  AcmeMemberNFT,
} from '../shared/ethers/types/typechain';
import { providers, Wallet, ContractReceipt } from 'ethers/lib';

@Injectable()
export class AcmeMemberNftContractService {
  private provider: providers.JsonRpcProvider;
  private signer: Wallet;
  private acmeMemberNftContractFactory: AcmeMemberNFT__factory;
  private acmeMemberNftContract: AcmeMemberNFT;

  constructor(private readonly configService: ConfigService) {
    this.provider = new providers.JsonRpcProvider({
      url: this.configService.get('EVM_URL'),
    });
    this.signer = new Wallet(
      this.configService.get('EVM_PRIVATE_KEY'),
      this.provider,
    );
    this.acmeMemberNftContractFactory = new AcmeMemberNFT__factory(this.signer);
    this.acmeMemberNftContract = this.acmeMemberNftContractFactory.attach(
      this.configService.get('EVM_ACME_MEMBER_NFT_CONTRACT_ADDRESS'),
    );
  }

  async getLockContractAddress(): Promise<string> {
    return this.acmeMemberNftContract.address;
  }

  async getLockContractOwner(): Promise<string> {
    return this.acmeMemberNftContract.owner();
  }

  async safeMint(to: string): Promise<ContractReceipt> {
    return (await this.acmeMemberNftContract.safeMint(to)).wait();
  }
}
