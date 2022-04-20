export function deepFreeze<T>(obj: T) {
  if (obj === null || obj === undefined) return obj;
  const propNames = Object.getOwnPropertyNames(obj);
  for (const prop of propNames) {
    const value = obj[prop as keyof T];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}
