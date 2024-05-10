import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class UserData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  type: string;
}
