import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

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
  constructor(file_path: string, def: T) {
    this.file_path = file_path;
    if (existsSync(file_path)) {
      try {
        this.data = JSON.parse(readFileSync(file_path, "utf-8"));
      } catch {
        this.data = def;
        this.write();
      }
    } else {
      this.data = def;
      this.write();
    }
  }

  public read() {
    this.data = JSON.parse(readFileSync(this.file_path).toString());
  }

  public write() {
    const dir = dirname(this.file_path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(this.file_path, JSON.stringify(this.data));
  }
}
