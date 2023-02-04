import { Service } from "typedi";
import { Wire } from "./di-utils";
import { _PrinterInterface, PrinterInterface } from "./PrinterInterface";

@Wire({ extends: _PrinterInterface })
@Service()
export class PrintService implements PrinterInterface {
  print() {
    console.log("I am alive!");
  }
}
