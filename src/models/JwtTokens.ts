// src/models/JwtTokens.ts

export class AccessToken {
  constructor(
    public token: string,
    public expiresIn: number // время жизни токена в секундах
  ) {}
}

export class RefreshToken {
  constructor(
    public token: string,
    public expiresIn: number // время жизни токена в секундах
  ) {}
}

export class JwtTokenPair {
  constructor(
    public accessToken: AccessToken,
    public refreshToken: RefreshToken
  ) {}
}

export class JwtPayload {
  constructor(
    public sub: string, // идентификатор пользователя
    public iat: number, // время выдачи токена
    public exp: number // время истечения токена
  ) {}

  // Здесь вы можете добавить дополнительные поля и методы по необходимости
}
