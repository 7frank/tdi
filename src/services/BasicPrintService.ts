import { AutoWireInject, AutoWireService } from "../helper";
import { NestedInterface } from "../interfaces/NestedInterface";
import { PrintInterface } from "../interfaces/PrintInterface";

@AutoWireService()
export class BasicPrintService implements PrintInterface {
  constructor(@AutoWireInject() private nestedService: NestedInterface) {}

  print(message?: string) {
    console.log(
      "Hello from 'BasicPrintService' that implements 'PrintInterface'",
      message ? "with message" + message : ""
    );
    this.nestedService.some();
  }
}
