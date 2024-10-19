import axios, { AxiosRequestConfig } from "axios";
import { IApiRequest } from "../../api/interfaces/IApiRequest";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function executeRequest<T>(request: IApiRequest): Promise<T> {
  const config: AxiosRequestConfig = {
    url: request.url,
    baseURL: request.baseUrl,
    method: request.methodType,
  };

  const cookies = request.cookies; // req.cookies доступен, если вы используете библиотеку для парсинга куков, например, cookie-parser

  console.log("Куки на сервере:", cookies); // Выводим куки в консоль сервера

  if (request.body) {
    config.data = request.body;
  }

  if (request.queryParameters) {
    config.params = request.queryParameters;
  }

  if (request.formData) {
    config.data = await request.formData();
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

export default axiosInstance;
