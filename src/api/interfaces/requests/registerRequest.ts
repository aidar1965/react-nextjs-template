import { AvailableApiMethods, IApiRequest } from "../IApiRequest";

interface RegisterRequestParams {
  email: string;
  password: string;
  repeatPassword: string;
  name: string;
}

export class RegisterRequest implements IApiRequest {
  methodType = AvailableApiMethods.POST;
  url: string = "/api/register";
  body: RegisterRequestParams;

  constructor(params: RegisterRequestParams) {
    this.body = params;
  }
}
