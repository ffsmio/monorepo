export function isEqualArray(a: unknown[], b: unknown[]): boolean {
  if (a === null) {
    return b === null;
  }

  if (a.length !== b.length) {
    return false;
  }

  if (a.length === 0) {
    return true;
  }

  for (let i = 0; i < a.length; i++) {
    const valueA = a[i];
    const valueB = b[i];

    if (!isEqual(valueA, valueB)) {
      return false;
    }
  }

  return true;
}

export function isEqualObject(a: object, b: object): boolean {
  if (a === null) {
    return b === null;
  }

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return isEqualArray(a, b);
    }

    return false;
  }

  const keyA = Object.keys(a);
  const keyB = Object.keys(b);

  if (keyA.length !== keyB.length) {
    return false;
  }

  if (keyA.length === 0) {
    return true;
  }

  for (const key of keyA) {
    if (!keyB.includes(key)) {
      return false;
    }

    const valueA = a[key as keyof typeof a];
    const valueB = b[key as keyof typeof b];

    if (!isEqual(valueA, valueB)) {
      return false;
    }
  }

  return true;
}

export function isEqual<T>(a: T, b: T): boolean {
  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object') {
    return isEqualObject(a as object, b as object);
  }

  return a === b;
}
