import { IsEmail, IsString } from 'class-validator';
import { ICourse, IUser } from '@purple/interfaces';

export namespace CourseGetCourse {
  export const topic = 'course.get-course.query';

  export class Request {
    @IsString()
    id: string;
  }

  export class Response {
    course: ICourse | null;
  }
}
