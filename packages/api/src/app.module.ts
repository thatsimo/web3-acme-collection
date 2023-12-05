import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcmeMemberNftContractModule } from './acme-member-nft-contract/acme-member-nft-contract.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AcmeMemberNftContractModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
