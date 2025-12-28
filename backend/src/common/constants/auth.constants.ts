/**
 * Constantes relacionadas à autenticação
 */
export const AUTH_CONSTANTS = {
  SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '1h',
} as const;

/**
 * Mensagens de erro de autenticação
 */
export const AUTH_ERROR_MESSAGES = {
  USER_ALREADY_EXISTS: 'Usuário já existe',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
} as const;
