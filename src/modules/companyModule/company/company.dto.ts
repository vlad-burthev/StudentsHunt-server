import { IsEmail, IsString, Length, IsOptional } from 'class-validator';
import { IsCorporateEmailValidator } from 'src/common/customValidators';

export class CreateUniversityDto {
  @IsString({ message: 'Email має бути рядком' })
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsCorporateEmailValidator()
  email: string;

  @IsString({ message: 'Пароль має бути рядком' })
  @Length(6, 255, { message: 'Пароль має містити щонайменше 6 символів' })
  password: string;

  @IsString({ message: 'Сайт має бути рядком' })
  @IsOptional() // Поле site може бути не обов'язковим
  site?: string;

  @IsOptional() // Поле avatar може бути не обов'язковим
  avatar?: File;

  @IsString({ message: 'Код ЄДРПОУ має бути рядком' })
  egrpouCode: string;
}
