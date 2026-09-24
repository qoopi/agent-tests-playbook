import { users, passwordVariable, type UserRole } from '../data/users';
import { readEnvWithName } from './env';

type Credentials = { username: string; password: string };

// Username and password of a role, read from .env at call time.
export function credentialsFor(role: UserRole): Credentials {
  return { username: readEnvWithName(users[role]), password: readEnvWithName(passwordVariable) };
}
