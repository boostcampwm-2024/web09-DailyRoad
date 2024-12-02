import { UnavailableException } from '@src/common/exception/UnavailableException';

export function UnavailableIn(env: string): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (process.env.NODE_ENV === env) {
        throw new UnavailableException(env);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
