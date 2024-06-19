import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccountChangeInfo,
  AccountLogin,
  AccountRegister,
} from '@purple/contracts';
import { RMQService } from 'nestjs-rmq';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ChangeInfoDto } from '../dtos/change-info.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly rmqService: RMQService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.rmqService.send<
        AccountRegister.Request,
        AccountRegister.Response
      >(AccountRegister.topic, dto);
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.rmqService.send<
        AccountLogin.Request,
        AccountLogin.Response
      >(AccountLogin.topic, dto);
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Patch('change-info/:id')
  async changeInfo(@Param('id') id: string, @Body() dto: ChangeInfoDto) {
    try {
      return await this.rmqService.send<
        AccountChangeInfo.Request,
        AccountChangeInfo.Response
      >(AccountChangeInfo.topic, { id, ...dto });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
