import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class IdDto {
  @Type(() => Number)
  id: number;
}

export class UserIdDto {
  @ApiProperty({ name: 'userId' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}
