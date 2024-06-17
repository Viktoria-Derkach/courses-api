import { Body, Controller } from '@nestjs/common';
import {
  AccountLogin,
  AccountRegister,
  AccountUserInfo,
} from '@purple/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class UserCommands {
  // constructor(private readonly authService: AuthService) {}
}
