import { Service } from "typedi";
import { Wire } from "./di-utils";
import { PrintInterface } from "./PrintInterface";

@Wire({ extends: PrintInterface })
@Service()
class BasicPrintService implements PrintInterface {
  print() {
    console.log("I am alive!");
  }
}
