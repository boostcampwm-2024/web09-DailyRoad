export interface SoftDeletableEntity<K> {
  id: K;
  deletedAt?: Date | null;
}
