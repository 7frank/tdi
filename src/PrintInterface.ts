import { defer } from "./di-utils";

export interface PrintInterface {
  print: () => void;
}
export const PrintInterface = defer<PrintInterface>();
