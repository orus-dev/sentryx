import { readFileSync } from "fs";

export function findKey<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): keyof T | undefined {
  return Object.entries(obj).find(([key, value]) =>
    predicate(value as T[keyof T], key as keyof T)
  )?.[0] as keyof T | undefined;
}

export default class Data<T> {
  data: T;
  file_path: string;
  constructor(file_path: string) {
    this.file_path = file_path;
    this.data = JSON.parse(readFileSync(this.file_path).toString());
  }

  public read() {
    this.data = JSON.parse(readFileSync(this.file_path).toString());
  }
}

export const sessions: { [key: string]: string } = {};
