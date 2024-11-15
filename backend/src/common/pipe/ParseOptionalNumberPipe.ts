import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseOptionalNumberPipe implements PipeTransform {
  constructor(private readonly defaultValue: number) {}

  transform(value: any): number {
    if (value === undefined || value === null) return this.defaultValue;

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      // Todo. class-transformer 가 먼저 적용돼 이미 NaN 으로 변환됨. -> undefined 인 경우와 구분 불가
      // throw new BadRequestException(
      //   `${metadata.data} 에 올바른 유효한 숫자 값을 입력해주세요.`,
      // );
      return this.defaultValue;
    }
    return parsedValue;
  }
}
