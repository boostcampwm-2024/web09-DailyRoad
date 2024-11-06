export interface SoftDeletableEntity<K extends Key> {
  id: K;
  deletedAt?: Date | null;
}

export type Key = NonNullable<string | number | Date>;
