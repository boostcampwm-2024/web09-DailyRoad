import { FindManyOptions, Repository, FindOptionsWhere } from 'typeorm';
import { SoftDeletableEntity } from './SoftDeletableEntity.interface';

/**
 * Soft Delete 를 지원
 * 기본적으로 deletedAt 이 null 인 것만 조회
 */
export abstract class SoftDeleteRepository<
  T extends SoftDeletableEntity<K>,
  K,
> extends Repository<T> {
  find(options: FindManyOptions<T> = {}) {
    return super.find({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: null,
      },
    });
  }

  findById(id: K) {
    return this.findOne({
      where: {
        id,
        deletedAt: null,
      } as FindOptionsWhere<T>,
    });
  }

  findAndCount(options: FindManyOptions<T> = {}) {
    return super.findAndCount({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: null,
      },
    });
  }

  count(options: FindManyOptions<T> = {}): Promise<number> {
    return super.count({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: null,
      },
    });
  }

  findOne(options: FindManyOptions<T> = {}) {
    return super.findOne({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: null,
      },
    });
  }

  softDelete(id: number) {
    return super.update(id, { deletedAt: new Date() } as any);
  }
}
