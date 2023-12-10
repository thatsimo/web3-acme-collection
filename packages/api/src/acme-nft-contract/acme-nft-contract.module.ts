import { Module } from '@nestjs/common';
import { AcmeNftContractService } from './acme-nft-contract.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AcmeNftContractService, ConfigService],
  exports: [AcmeNftContractService],
})
export class AcmeNftContractModule {}
