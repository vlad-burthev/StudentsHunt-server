import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';
import { IsCorporateEmailValidator } from 'src/common/customValidators';

export class CreateRecruiterDTO {
  @IsString({ message: 'Email має бути рядком' })
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsCorporateEmailValidator({ message: 'Необхідна корпоративна пошта' })
  email: string;

  @IsString({ message: 'Пароль має бути рядком' })
  @Length(6, 255, { message: 'Пароль має містити щонайменше 6 символів' })
  password: string;

  @IsString({ message: 'Імʼя повинно бути строкою' })
  @Length(4, 50, { message: 'Імʼя повино бути довше за 4 літери' })
  name: string;

  @IsPhoneNumber('UA', { message: 'Некоректний номер телефону' })
  phone: string;
}
