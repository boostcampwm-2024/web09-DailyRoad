import { ServiceUnavailableException } from '@nestjs/common';

export function UnavailableIn(env: string): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (process.env.NODE_ENV === env) {
        throw new ServiceUnavailableException(
          `현재는 지원하지 않는 서비스입니다. [${env} 환경]`,
        );
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
