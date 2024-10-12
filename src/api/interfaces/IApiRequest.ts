export enum AvailableApiMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

export interface IApiRequest {
  methodType: AvailableApiMethods;
  url: string;
  baseUrl?: string;
  body?: unknown;
  formData?: () => Promise<FormData>;
  queryParameters?: Record<string, string | number | boolean | undefined>;
}
