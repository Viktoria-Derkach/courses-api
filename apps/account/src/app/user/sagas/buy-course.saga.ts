import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { PurchaseState } from '@purple/interfaces';
import { BuyCourseSagaState } from './buy-course.state';
import { BuyCourseSagaStateStarted } from './buy-course.steps';

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(
    public user: UserEntity,
    public courseId: string,
    public rmqService: RMQService
  ) {}

  setState(state: PurchaseState, courseId) {
    switch (state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.WaitingForPayment:
        break;
      case PurchaseState.Purchased:
        break;
      case PurchaseState.Cenceled:
        break;
    }

    // context
    this.state.setContext(this);
    this.user.updateCourseStatus(courseId, state);
  }

  getState() {
    return this.state;
  }
}