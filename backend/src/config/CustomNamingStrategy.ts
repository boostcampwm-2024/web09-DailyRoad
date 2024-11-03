import {DefaultNamingStrategy, NamingStrategyInterface} from 'typeorm';
import {snakeCase} from 'typeorm/util/StringUtils';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  // 테이블 이름 규칙 (PascalCase 사용)
  tableName(className: string, customName: string): string {
    return customName ? customName : className;
  }

  // 컬럼 이름 규칙 (snake_case 사용)
  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.join('_') + (customName ? customName : propertyName));
  }

  // 관계 컬럼 이름 규칙 (snake_case 사용)
  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}
