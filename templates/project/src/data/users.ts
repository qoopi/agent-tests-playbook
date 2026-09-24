// Roles map to the variable names in .env; values are read at run time by credentialsFor.
export type UserRole = 'session';

export const users = {
  session: 'TEST_USER_EMAIL',
} as const satisfies Record<UserRole, string>;

export const passwordVariable = 'TEST_USER_PASSWORD';
