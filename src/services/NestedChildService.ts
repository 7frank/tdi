import { AutoWireService } from "../helper";
import { NestedInterface } from "../interfaces/NestedInterface";

@AutoWireService()
export class NestedChildService implements NestedInterface {
  some() {
    console.log("I'm a nested service ");
  }
}
