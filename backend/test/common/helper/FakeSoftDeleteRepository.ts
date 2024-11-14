import { Injectable } from '@nestjs/common';
import { FakeRepository } from './fakeRepository';

@Injectable()
export abstract class FakeSoftDeleteRepository<T extends { id: K; deletedAt?: Date }, K> extends FakeRepository<T, K> {
  async find(options: { where?: Partial<T>; skip?: number; take?: number } = {}): Promise<T[]> {
    const filteredOptions = this.applyDeletedAtCondition(options.where);
    return super.find({ ...options, where: filteredOptions });
  }

  async findById(id: K): Promise<T | undefined> {
    const entity = await super.findById(id);
    return entity && !entity.deletedAt ? entity : undefined;
  }

  async findAndCount(options: { where?: Partial<T>; skip?: number; take?: number } = {}): Promise<[T[], number]> {
    const filteredOptions = this.applyDeletedAtCondition(options.where);
    const result = await super.find({ ...options, where: filteredOptions });
    return [result, result.length];
  }

  async findOne(options: { where?: Partial<T> } = {}): Promise<T | undefined> {
    const result = await this.find({ where: options.where });
    return result.length > 0 ? result[0] : undefined;
  }

  async softDelete(id: K): Promise<void> {
    const entity = await this.findById(id);
    if (entity) {
      entity.deletedAt = new Date();
    }
  }

  async count(options: { where?: Partial<T> } = {}): Promise<number> {
    const filteredOptions = this.applyDeletedAtCondition(options.where);
    return super.count({ where: filteredOptions });
  }

  async existById(id: K): Promise<boolean> {
    return this.entities.some(entity => entity.id === id && !entity.deletedAt);
  }

  private applyDeletedAtCondition(where: Partial<T> | undefined) {
    if (!where) return { deletedAt: null } as Partial<T>;
    return { ...where, deletedAt: null };
  }
}
