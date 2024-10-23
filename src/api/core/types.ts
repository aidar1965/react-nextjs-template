import { AxiosRequestConfig } from "axios";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface RequestConfig<T = unknown> extends AxiosRequestConfig {
  data?: T;
}

export interface BaseRequestConfig {
  httpMethod: HttpMethod;
  url: string;
  params?: Record<string, unknown>;
  body?: unknown;
}
