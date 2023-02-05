import "reflect-metadata";
import { Container, Inject, Service } from "typedi";
import { PrintInterface } from "./PrintInterface";

// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work
import "./di.generated";
import { CrudInterface } from "./CrudInterface";
import { User } from "./User";

@Service()
class Application {
  constructor(
    @Inject() public printService: PrintInterface,
    @Inject() public databaseService: CrudInterface<User> // Note: we do currently have no type checks for template parameters,
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
