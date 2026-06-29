import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: [String] })
  roles: string[];

  @ApiProperty()
  expiresIn: string;
}
