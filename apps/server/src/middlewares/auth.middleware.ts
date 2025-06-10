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
      return res.status(401).json({ "message": "Authentication token missing" });
    }
    
    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
        return res.status(401).json({ "message": "Invalid or expired token. Please login again" });
    }
    
    const user = await getUserById(payload.userId);
    if (!user) {
        return res.status(404).json({ "message": "User not found" });
    }

    if (!user.two_factor_verified) {
      return res.status(403).json({ "message": "Access denied: Two factor authentication not enabled" });
    }

    if (!payload.is2FAverifiedSession) {
      return res.status(403).json({ "message": "Access denied: Two factor authentication on login not completed" })
    }

    req.user = user;
    next();
    return;
  } catch (err) {
    return res.status(403).json({ "message": "Invalid or expired token" });
  }
}