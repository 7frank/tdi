import { Service as DiService } from "typedi";
import { PrintInterface } from "./PrintInterface";

@DiService()
export class BasicPrintService implements PrintInterface {
  print() {
    console.log("I am alive!");
  }
}
