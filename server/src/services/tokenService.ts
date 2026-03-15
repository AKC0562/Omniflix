import jwt from 'jsonwebtoken';
import config from '../config';
import { ITokenPayload } from '../types';

export const generateAccessToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as ITokenPayload;
};

export const generateTokenPair = (
  payload: ITokenPayload
): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
