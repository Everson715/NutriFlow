export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  access_token: string;
};

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

