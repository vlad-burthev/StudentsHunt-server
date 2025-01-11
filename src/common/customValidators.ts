// is-corporate-email.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { publicEmailDomains } from './publicDomains'; // Импортируйте ваш массив доменов

@ValidatorConstraint({ name: 'isCorporateEmail', async: false })
export class IsCorporateEmail implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return true; // если значение пустое, пропускаем валидацию

    const domain = value.split('@')[1]?.toLowerCase();
    return !publicEmailDomains.includes(domain);
  }

  defaultMessage() {
    return 'Пошта повинна бути корпоративною'; // Сообщение об ошибке
  }
}

// Функция для регистрации валидатора
export function IsCorporateEmailValidator(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCorporateEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCorporateEmail,
    });
  };
}
