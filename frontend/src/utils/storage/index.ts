type StorageType = 'local' | 'session';

const getStorage = (type: StorageType): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

export const getStoredItem = <T>(key: string, initialValue: T, storageType: StorageType = 'local'): T => {
  const storage = getStorage(storageType);
  const item = storage.getItem(key);

  if (item) {
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`JSON 파싱 오류: ${storageType}Storage에서 키 "${key}"를 파싱하는 중 오류가 발생했습니다.`, error);
    }
  }

  return initialValue;
};

export const setStoredItem = <T>(key: string, value: T, storageType: StorageType = 'local'): void => {
  const storage = getStorage(storageType);
  try {
    const serializedValue = JSON.stringify(value);
    storage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`JSON 직렬화 오류: ${storageType}Storage에 키 "${key}"를 저장하는 중 오류가 발생했습니다.`, error);
  }
};
