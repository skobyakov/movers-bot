import {
  IsDefined,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MessageEntity {
  @IsDefined()
  @IsString()
  type: 'bot_command' | string;

  @IsDefined()
  @IsNumber()
  offset: number;

  @IsDefined()
  @IsNumber()
  length: number;
}

export class Chat {
  @IsDefined()
  @IsNumber()
  id: number;

  @IsDefined()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;
}

export class Message {
  @IsDefined()
  @IsNumber()
  message_id: number;

  @IsDefined()
  @IsNumber()
  date: number;

  @IsDefined()
  @ValidateNested()
  chat: Chat;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @ValidateNested()
  entities?: MessageEntity[];
}

export class UpdateDTO {
  @IsDefined()
  @IsNumber()
  update_id: number;

  @IsDefined()
  @ValidateNested()
  message: Message;
}
