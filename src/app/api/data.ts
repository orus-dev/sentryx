export function findKey<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): keyof T | undefined {
  return Object.entries(obj).find(([key, value]) =>
    predicate(value as T[keyof T], key as keyof T)
  )?.[0] as keyof T | undefined;
}

export type User = {
  username: string;
  password: string;
};

export const users = {
  admin: {
    username: "admin",
    password: "admin",
  },
};

export const sessions: { [key: string]: string } = {};
