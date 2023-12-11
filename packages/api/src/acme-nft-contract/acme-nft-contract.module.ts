import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AcmeNftContractService } from './acme-nft-contract.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [AcmeNftContractService, ConfigService],
  exports: [AcmeNftContractService],
})
export class AcmeNftContractModule {}
