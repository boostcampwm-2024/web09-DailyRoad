import { Transform } from 'class-transformer';

/**
 * 빈 문자열을 기본값으로 변환합니다.
 * @param defaultValue
 */
export function ReplaceEmptyWith(defaultValue: string): PropertyDecorator {
  return Transform(({ value }) => (value === '' ? defaultValue : value));
}
