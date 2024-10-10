import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { ITokenUserData } from 'src/interface';

config();

export const generateToken = (userData) => {
  const accessToken = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
    expiresIn: '24h',
  });
  const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_SECRET_KE, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};
