import { AvailableApiMethods, IApiRequest } from "../IApiRequest";

interface GetPastsParams {
  page?: number;
  limit?: number;
}

export class GetPostRequest implements IApiRequest {
  methodType: AvailableApiMethods = AvailableApiMethods.GET;
  baseUrl: string = "https://jsonplaceholder.typicode.com";
  url: string = "/posts";
  queryParameters:
    | Record<string, string | number | boolean | undefined>
    | undefined;

  constructor(params: GetPastsParams) {
    this.queryParameters = {
      _page: params.page ?? 1,
      _limit: params.limit ?? 10,
    };
  }
}
