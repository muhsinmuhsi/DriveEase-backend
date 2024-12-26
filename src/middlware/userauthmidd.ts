import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import { apperror } from '../utils/apperror';
import catcherror from '../utils/catcherror';

export const userauthmidd = catcherror(async (req: any, res: Response, next: NextFunction) => {
  const SECRET_KEY = process.env.JWT_SECRET as string;  
  const token = req.cookies?.token  || req.headers.authorization?.split(' ')[1];
  
  
  if (!token) {
    return next(new apperror('You are not logged in. Please log in to access this resource.', 401));
  }

  const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & { id: string };
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new apperror('The user belonging to this token no longer exists.', 401));
  }

  req.user = currentUser; // Attach user to the request
  next();
});
