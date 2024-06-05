export const groupBy = <T, K>(array: T[], key: (item: T) => K): Map<K, T[]> => {
  const map = new Map<K, T[]>();
  array.forEach((item) => {
    const k = key(item);
    const v = map.get(k) || [];
    v.push(item);
    map.set(k, v);
  });
  return map;
};

export const reduceBy = <T, K, R>(
  array: T[],
  key: (item: T) => K,
  reducer: (acc: R, item: T) => R,
  initialValue: R
): Map<K, R> => {
  const map = new Map<K, R>();
  array.forEach((item) => {
    const k = key(item);
    const v = map.get(k) || initialValue;
    map.set(k, reducer(v, item));
  });
  return map;
};
