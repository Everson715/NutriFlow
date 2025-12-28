export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  access_token: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
};
