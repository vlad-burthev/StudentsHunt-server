import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';

config();

export const generateToken = (userData) => {
  delete userData.exp;

  const accessToken = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
    expiresIn: '24h',
  });
  const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};
