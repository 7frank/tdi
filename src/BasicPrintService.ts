import { AutoWireService } from "./helper";
import { PrintInterface } from "./PrintInterface";

@AutoWireService()
export class BasicPrintService implements PrintInterface {
  print() {
    console.log("I am alive!");
  }
}
