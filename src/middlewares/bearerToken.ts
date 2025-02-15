import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { DecodedAuthorization, ExtendedRequest } from '@/types/auth';

const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization header missing',
    });
  }

  try {
    const splitted  = authHeader.split(' ');
    const token = splitted?.[1];

    jwt.verify(token || authHeader, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Token invalid:', err.message);
        res.status(498).json({
          message: 'Invalid token.',
        });
      } else {
        req.user = decoded as DecodedAuthorization;
        next();
      }
    });
  } catch (ex) {
    res.status(498).json({
      message: 'Invalid token.',
    });
  }
};
