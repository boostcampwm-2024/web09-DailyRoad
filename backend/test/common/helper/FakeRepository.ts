import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FakeRepository<T, K> {
  protected entities: T[] = [];

  async find(options: { where?: Partial<T>; skip?: number; take?: number } = {}): Promise<T[]> {
    let result = this.entities;

    if (options.where) {
      result = result.filter(entity =>
        Object.keys(options.where!).every(
          key => (entity as any)[key] === (options.where as any)[key],
        ),
      );
    }

    const skip = options.skip || 0;
    const take = options.take || result.length;
    return result.slice(skip, skip + take);
  }

  async findById(id: K): Promise<T | undefined> {
    return this.entities.find(entity => (entity as any).id === id);
  }

  async findAndCount(options: { where?: Partial<T>; skip?: number; take?: number } = {}): Promise<[T[], number]> {
    const result = await this.find(options);
    return [result, result.length];
  }

  async save(entity: T): Promise<T> {
    this.entities.push(entity);
    return entity;
  }

  async update(id: K, updatedEntity: Partial<T>): Promise<T | undefined> {
    const index = this.entities.findIndex(entity => (entity as any).id === id);
    if (index > -1) {
      this.entities[index] = { ...this.entities[index], ...updatedEntity };
      return this.entities[index];
    }
    return undefined;
  }

  async delete(id: K): Promise<void> {
    this.entities = this.entities.filter(entity => (entity as any).id !== id);
  }

  async count(options: { where?: Partial<T> } = {}): Promise<number> {
    return (await this.find(options)).length;
  }

  async existById(id: K): Promise<boolean> {
    return this.entities.some(entity => (entity as any).id === id);
  }
}
