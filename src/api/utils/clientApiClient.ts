// src/utils/clientApiClient.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import { BaseRequest, RequestConstructor } from "@/api/core/BaseRequest";

interface ApiErrorResponse {
  message: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiClient = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

export async function makeRequest<TResponse, TMapped>(
  request: BaseRequest<TResponse, TMapped>
): Promise<TMapped> {
  try {
    const config = request.toRequestConfig();
    const response: AxiosResponse<TResponse> = await apiClient(config);
    console.log(response.data);

    // Правильное приведение типа конструктора
    const RequestClass = request.constructor as RequestConstructor<
      TResponse,
      TMapped
    >;
    return RequestClass.fromResponse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new ApiError(
        axiosError.response?.status || 500,
        axiosError.response?.data?.message || axiosError.message,
        axiosError.response?.data
      );
    }
    throw new ApiError(500, "Unexpected error occurred");
  }
}

export default apiClient;
