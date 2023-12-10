import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcmeMemberNftContractModule } from './acme-member-nft-contract/acme-member-nft-contract.module';

import { ConfigModule } from '@nestjs/config';
import { AcmeNftContractModule } from './acme-nft-contract/acme-nft-contract.module';

@Module({
  imports: [
    AcmeMemberNftContractModule,
    ConfigModule.forRoot(),
    AcmeNftContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
