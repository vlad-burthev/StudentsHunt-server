import {
  IsEmail,
  IsString,
  Length,
  IsOptional,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';
import { IsCorporateEmailValidator } from 'src/common/customValidators';

export class CreateCompanyDto {
  @IsString({ message: 'Email має бути рядком' })
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsCorporateEmailValidator({ message: 'Необхідна корпоративна пошта' })
  email: string;

  @IsString({ message: 'Пароль має бути рядком' })
  @Length(6, 255, { message: 'Пароль має містити щонайменше 6 символів' })
  password: string;

  @IsString({ message: 'Сайт має бути строкою' })
  site: string;

  @IsPhoneNumber('UA', { message: 'Некоректний номер телефону' })
  phone: string;

  @IsNotEmpty({ message: 'Код ЄДРПОУ не може бути пустим' })
  egrpouCode: string;

  @IsNotEmpty({
    message: 'Поле з інформацією про компанію не може бути пустим',
  })
  about: string;
}
