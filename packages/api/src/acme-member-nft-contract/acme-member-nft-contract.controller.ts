import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AcmeMemberNftContractService as AcmeMemberNftContractService } from './acme-member-nft-contract.service';
import * as ethers from 'ethers/lib';
import { ApiTags } from '@nestjs/swagger';
import { EthersError } from 'src/shared/ethers/types/EthersError';
import { AcmeMemberNFTMintDTO } from './acme-member-nft-mint.dto';

@Controller('api/acme-member-nft-contract')
@ApiTags('acme-nft-contracts')
export class AcmeMemberNftContractController {
  constructor(
    private readonly acmeMemberNftContractService: AcmeMemberNftContractService,
  ) {}

  @Get('/owner')
  async getOwner(): Promise<string> {
    try {
      return await this.acmeMemberNftContractService.getLockContractOwner();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/address')
  async getLockContractAddress(): Promise<string> {
    try {
      return await this.acmeMemberNftContractService.getLockContractAddress();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/mint')
  async mint(
    @Body() { to }: AcmeMemberNFTMintDTO,
  ): Promise<ethers.ContractTransaction> {
    try {
      return await this.acmeMemberNftContractService.safeMint(to);
    } catch (error) {
      const ethersErros = error as unknown as EthersError;
      console.error(ethersErros.reason);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
