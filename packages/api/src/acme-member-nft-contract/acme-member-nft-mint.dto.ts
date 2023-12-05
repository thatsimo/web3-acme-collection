import { ApiProperty } from '@nestjs/swagger';

export class AcmeMemberNFTMint {
  @ApiProperty()
  to: string;
}
