import { Body, Controller } from '@nestjs/common';
import {
  AccountLogin,
  AccountRegister,
  AccountUserInfo,
  AccountChangeInfo,
} from '@purple/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';

@Controller()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {}
  @RMQValidate()
  @RMQRoute(AccountChangeInfo.topic)
  async userInfo(
    @Body() dto: AccountChangeInfo.Request
  ): Promise<AccountChangeInfo.Response> {
    const { id, ...updateData } = dto;
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error('There is no such user');
    }

    await this.userRepository.updateUser(id, updateData);

    return {};
  }
}
