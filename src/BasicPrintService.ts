import { Service } from "typedi";
import AutoWire from "./di-utils";
import { PrintInterface } from "./PrintInterface";

@AutoWire({ extends: PrintInterface })
@Service()
class BasicPrintService implements PrintInterface {
  print() {
    console.log("I am alive!");
  }
}
