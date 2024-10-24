import { IsEmail, IsString, Length } from 'class-validator';
import { IsCorporateEmailValidator } from 'src/common/customValidators';

export class LoginDTO {
  @IsString({ message: 'Email має бути рядком' })
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsCorporateEmailValidator({ message: 'Необхідна корпоративна пошта' })
  email: string;

  @IsString({ message: 'Пароль має бути рядком' })
  @Length(6, 255, { message: 'Пароль має містити щонайменше 6 символів' })
  password: string;
}
