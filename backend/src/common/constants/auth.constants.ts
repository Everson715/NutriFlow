import { StringValue } from "ms";
export const AUTH_CONSTANTS = {
  SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '1d' as StringValue,
};

export const AUTH_ERROR_MESSAGES = {
  USER_ALREADY_EXISTS: 'Usuário já cadastrado',
  INVALID_CREDENTIALS: 'Email ou senha inválidos',
};
