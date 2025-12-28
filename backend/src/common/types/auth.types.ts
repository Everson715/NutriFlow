/**
 * Tipos relacionados à autenticação
 */

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
