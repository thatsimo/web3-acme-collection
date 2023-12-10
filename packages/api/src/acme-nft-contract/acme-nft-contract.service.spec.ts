import { Test, TestingModule } from '@nestjs/testing';
import { AcmeNftContractService } from './acme-nft-contract.service';

describe('AcmeNftContractService', () => {
  let service: AcmeNftContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcmeNftContractService],
    }).compile();

    service = module.get<AcmeNftContractService>(AcmeNftContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
