import { IsString, IsOptional } from 'class-validator';

export class RagChatDto {
  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
