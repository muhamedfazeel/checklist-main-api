import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty({ name: 'userId' })
  userId: number;
}
