import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshBody {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
