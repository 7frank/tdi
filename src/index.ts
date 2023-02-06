import "reflect-metadata";
import { Container } from "typedi";
import { PrintInterface } from "./interfaces/PrintInterface";

// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work
import "./di.generated";
import { CrudInterface } from "./interfaces/CrudInterface";
import { User } from "./interfaces/User";
import { AutoWireService, AutoWireInject } from "./helper";

@AutoWireService()
class Application {
  constructor(
    @AutoWireInject() public printService: PrintInterface,
    @AutoWireInject() public databaseService: CrudInterface<User> // Note: we do currently have no type checks for template parameters,
  ) {}
}

const instance = Container.get(Application);

instance.printService.print();
// prints "I am alive!" (InjectedExampleClass.print function)

instance.databaseService.create({ id: 1, name: "Frank" });
const user = instance.databaseService.read(1);
console.log(user);

const dummyPrinter = new (class Dummy {
  print() {
    console.log("Not injected");
  }
})();

// not injected, good for testing
const testee = new Application(
  dummyPrinter,
  null as unknown as CrudInterface<User>
);

testee.printService.print();
