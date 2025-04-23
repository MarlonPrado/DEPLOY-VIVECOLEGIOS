export type Lazy<T extends object> = Promise<T> | T;

export function removeEmptyStringElements(obj: any) {
  for (var prop in obj) {
    if (typeof obj[prop] === 'object') {
      // dive deeper in
      removeEmptyStringElements(obj[prop]);
    } else if (obj[prop] === '') {
      // delete elements that are empty strings
      delete obj[prop];
    }
  }
  return obj;
}