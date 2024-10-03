import * as jwt from 'jsonwebtoken';
import { ITokenUserData } from 'src/interface';

const generateToken = (userData: ITokenUserData): string => {
  const token = jwt.sign(userData, process.env.SECRET_KEY, {
    expiresIn: '24h', // Установите время жизни токена
  });
  return token;
};
