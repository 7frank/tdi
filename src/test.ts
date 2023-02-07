import "reflect-metadata";
import "./di.generated";
import { Service } from "typedi";
import { PrintInterface } from "./interfaces/PrintInterface";
import { CrudInterface } from "./interfaces/CrudInterface";
import { User } from "./interfaces/User";
import { AutoWireInject } from "./helper";

@Service()
class Application {
  constructor(@AutoWireInject() public printService: PrintInterface) {}
}

const dummyPrinter = new (class Dummy {
  print() {
    console.log("it works");
  }
})();

// not injected, good for testing
const testee = new Application(dummyPrinter);

testee.printService.print();
