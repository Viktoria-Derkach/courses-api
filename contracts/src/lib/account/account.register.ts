export namespace AccountRegister {
  const topic = 'account.login.command';

  export class Request {
    email: string;
    password: string;
    displayName?: string;
  }

  export class Response {
    email: string;
  }
}
