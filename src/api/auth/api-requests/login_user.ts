/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginRequest } from "@/api/interfaces/requests/loginRequest";
import LoginResponse from "@/api/interfaces/responses/LoginResponse";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    // const request = new LoginRequest({ email: email, password: password });
    // const response = await executeRequest<LoginResponse>(request);

    const response = {
      user: {
        id: 1,
        name: "John Doe",
        email: "john@gmail.com",
      },
    };

    return response.user;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to login");
  }
}
