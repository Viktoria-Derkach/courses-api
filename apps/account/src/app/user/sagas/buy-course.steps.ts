import {
  CourseGetCourse,
  PaymentCheck,
  PaymentGenerateLink,
} from '@purple/contracts';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
import { PurchaseState } from '@purple/interfaces';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, { id: this.saga.courseId });

    if (!course) {
      throw new Error('There is no such course');
    }

    if (course.price == 0) {
      this.saga.setState(PurchaseState.Purchased, course._id);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    });

    this.saga.setState(PurchaseState.WaitingForPayment, course._id);

    return { paymentLink, user: this.saga.user };
  }
  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('You cant check payment, which hasnt been started');
  }
  public async cencel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Cenceled, this.saga.courseId);
    return { user: this.saga.user };
  }
}
export class BuyCourseSagaStateWaitingForPayments extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Payment has been started.');
  }
  public async checkPayment(): Promise<{ user: UserEntity }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      courseId: this.saga.courseId,
      userId: this.saga.user._id,
    });

    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Cenceled, this.saga.courseId);
      return { user: this.saga.user };
    }

    if (status !== 'success') {
      return { user: this.saga.user };
    }

    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);

    return { user: this.saga.user };
  }
  public cencel(): Promise<{ user: UserEntity }> {
    throw new Error('You cannot cancel');
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Payment has been finished.');
  }

  public async checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('You cannot check payment');
  }
  public cencel(): Promise<{ user: UserEntity }> {
    throw new Error('You cannot cancel');
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }
  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('No check.');
  }
  public cencel(): Promise<{ user: UserEntity }> {
    throw new Error('You cannot cancel what is canceled');
  }
}
