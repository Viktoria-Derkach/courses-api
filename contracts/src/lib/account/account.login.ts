export namespace AccountLogin {
  const topic = 'account.login.command';

  export class Request {
    email: string;
    password: string;
  }

  export class Response {
    access_token: string;
  }
}
