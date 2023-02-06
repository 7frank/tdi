import { AutoWireInject, AutoWireService } from "../helper";
import { NestedInterface } from "../interfaces/NestedInterface";
import { PrintInterface } from "../interfaces/PrintInterface";

@AutoWireService()
export class BasicPrintService implements PrintInterface {
  constructor(@AutoWireInject() private nestedService: NestedInterface) {}

  print() {
    console.log("I am alive!");
    this.nestedService.some();
  }
}
