import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '../utils/jwt';
import { getUserById } from '../services/user.service';


export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies['access_token'];
    if (!token) {
      return res.status(401).send('Authentication token missing');
    }
    
    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
        return res.status(403).send('Invalid or expired token');
    }
    
    const user = await getUserById(payload.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    req.user = user;
    next();
    return;
  } catch (err) {
    return res.status(403).send('Invalid or expired token');
  }
}