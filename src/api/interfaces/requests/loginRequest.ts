import { IApiRequest, AvailableApiMethods } from "../IApiRequest";

interface LoginParams {
  email: string;
  password: string;
}

export class LoginRequest implements IApiRequest {
  methodType: AvailableApiMethods = AvailableApiMethods.POST;
  url: string = "/api/login";
  body: LoginParams;

  constructor(params: LoginParams) {
    this.body = params;
  }
}
