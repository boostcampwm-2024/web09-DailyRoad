type StorageType = 'local' | 'session';

const getStorage = (type: StorageType): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

export const getStoredItem = <T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'local',
): T => {
  const storage = getStorage(storageType);
  const item = storage.getItem(key);

  if (item) {
    return JSON.parse(item) as T;
  }

  return initialValue;
};

export const setStoredItem = <T>(
  key: string,
  value: T,
  storageType: StorageType = 'local',
): void => {
  const storage = getStorage(storageType);

  const serializedValue = JSON.stringify(value);
  storage.setItem(key, serializedValue);
};
