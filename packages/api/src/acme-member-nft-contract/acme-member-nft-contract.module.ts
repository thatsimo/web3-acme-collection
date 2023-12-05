import { Module } from '@nestjs/common';
import { AcmeMemberNftContractService } from './acme-member-nft-contract.service';
import { AcmeMemberNftContractController } from './acme-member-nft-contract.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AcmeMemberNftContractService, ConfigService],
  controllers: [AcmeMemberNftContractController],
  exports: [AcmeMemberNftContractService],
})
export class AcmeMemberNftContractModule {}
