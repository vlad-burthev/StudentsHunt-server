export enum ERole {
  admin = 'admin',
  company = 'company',
  recruiter = 'recruiter',
}

export enum EResourceType {
  image = 'image',
  pdf = 'raw',
}

export interface ITokenUserData {
  id: string;
  role: ERole;
  slug: string;
  isActivated: boolean;
  isVerified: boolean;
  refreshToken?: string;
}

export interface IEgrpou {
  egrpou: string;
  name: string;
  name_short: string;
  address: string;
  director: string;
  kved: string;
  inn: string;
  inn_date: string;
}
