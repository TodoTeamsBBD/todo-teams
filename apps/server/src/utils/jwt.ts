import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env['JWT_SECRET']!;
const ACCESS_TOKEN_EXPIRES_IN = '30m';

export interface JwtPayload {
  userId: string;
  name: string;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    issuer: 'todo-teams-api',
    audience: 'todo-teams-client',
  });
}

export function verifyJwt(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS512'],
    issuer: 'todo-teams-api',
    audience: 'todo-teams-client',
  });

  return decoded as JwtPayload;
}
