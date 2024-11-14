import {
  registerDecorator,
  ValidationArguments,
  ValidatorOptions,
} from 'class-validator';
import { IMAGE_EXTENSIONS } from './storage.constants';

export function IsImageFile(validationOptions?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsImageFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return IMAGE_EXTENSIONS.has(value);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${validationArguments.value} 는 이미지 확장자가 아닙니다.`;
        },
      },
    });
  };
}
