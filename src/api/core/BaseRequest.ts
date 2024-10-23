/* eslint-disable @typescript-eslint/no-unused-vars */
// src/api/core/BaseRequest.ts
import { RequestConfig } from "./types";

export abstract class BaseRequest<TResponse, TMapped> {
  constructor(protected config: RequestConfig) {}

  toRequestConfig(): RequestConfig {
    return this.config;
  }

  // Важно: абстрактный статический метод
  static fromResponse(_response: unknown): unknown {
    throw new Error("fromResponse must be implemented");
  }
}

// Вспомогательный тип для типизации конструктора
export interface RequestConstructor<TResponse, TMapped> {
  new (...args: unknown[]): BaseRequest<TResponse, TMapped>;
  fromResponse(response: TResponse): TMapped;
}
