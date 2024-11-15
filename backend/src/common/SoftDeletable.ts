import { FindManyOptions } from 'typeorm';
import { SoftDeletableEntity, Key } from './SoftDeletableEntity.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export abstract class SoftDeletable<
  T extends SoftDeletableEntity<K>,
  K extends Key,
> {
  abstract find(options?: FindManyOptions<T>): Promise<T[]>;

  abstract findOne(options?: FindManyOptions<T>): Promise<T | undefined>;

  abstract findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;

  abstract count(options?: FindManyOptions<T>): Promise<number>;

  abstract findById(id: K): Promise<T | undefined>;

  abstract softDelete(id: K): Promise<UpdateResult>;

  abstract existById(id: K): Promise<boolean>;
}
