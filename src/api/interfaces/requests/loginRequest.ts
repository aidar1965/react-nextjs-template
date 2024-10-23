import { User } from "@/app/models/User";
import { IApiRequest, AvailableApiMethods } from "../IApiRequest";
import { BaseRequest } from "@/api/core/BaseRequest";
import { HttpMethod } from "@/api/core/types";
import LoginResponse from "../responses/LoginResponse";

export class LoginRequest extends BaseRequest<LoginResponse, User> {
  constructor(public email: string, public password: string) {
    super({
      method: HttpMethod.POST, // исправлено с method на httpMethod
      url: "/api/login",
      data: {
        email: email, // убрано присваивание значения
        password: password, // убрано присваивание значения
      },
    });
  }

  // Добавляем статический метод fromResponse, который требуется от BaseRequest
  static fromResponse(response: LoginResponse): User {
    return new User(response.id, response.name ?? "", response.email ?? ""); // предполагая, что LoginResponse содержит поле user
  }
}
