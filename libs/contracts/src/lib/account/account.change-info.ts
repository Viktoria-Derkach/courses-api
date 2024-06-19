import { IUser } from '@purple/interfaces';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export namespace AccountChangeInfo {
  export const topic = 'account.change-info.command';

  export class Request {
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    displayName?: string;

    @IsOptional()
    @IsString()
    street?: string;
  }

  export class Response {}
}
