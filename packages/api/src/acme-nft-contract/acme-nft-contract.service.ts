import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wallet, providers } from 'ethers';
import { AcmeNFT, AcmeNFT__factory } from 'src/shared/ethers/types/typechain';

@Injectable()
export class AcmeNftContractService implements OnModuleInit {
  private provider: providers.JsonRpcProvider;
  private signer: Wallet;
  private acmeNftContractFactory: AcmeNFT__factory;
  private acmeNftContract: AcmeNFT;

  constructor(private readonly configService: ConfigService) {
    this.provider = new providers.JsonRpcProvider({
      url: this.configService.get('EVM_URL'),
    });

    this.signer = new Wallet(
      this.configService.get('EVM_PRIVATE_KEY'),
      this.provider,
    );

    this.acmeNftContractFactory = new AcmeNFT__factory(this.signer);
    this.acmeNftContract = this.acmeNftContractFactory.attach(
      this.configService.get('EVM_ACME_NFT_CONTRACT_ADDRESS'),
    );
  }

  onModuleInit() {
    this.acmeNftContract.on(
      this.acmeNftContract.filters.CustomNamePurchased(null, null),
      async (tokenId, customName, event) => {
        const tokenURI = await this.acmeNftContract.tokenURI(tokenId);
        const ipfsPinHash = tokenURI.replace('https://ipfs.io/ipfs/', '');

        const headers = {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${this.configService.get('PINATA_JWT')}`,
        };

        const body = JSON.stringify({
          ipfsPinHash,
          keyvalues: JSON.stringify({
            name: customName,
          }),
        });

        await fetch('https://api.pinata.cloud/pinning/hashMetadata', {
          method: 'PUT',
          headers,
          body,
        });

        console.log({ tokenId, customName, tokenURI, event });
      },
    );
  }
}
