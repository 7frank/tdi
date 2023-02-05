import { defer } from "./di-utils";

export interface CrudInterface<T extends { id: number }> {
  create: (t: T) => void;
  read: (id: number) => T;
  update: (t: { id: number } & Partial<T>) => void;
  delete: (id: number) => boolean;
}
export const CrudInterface = defer<CrudInterface<any>>();
