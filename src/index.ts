import "reflect-metadata";
import { Container, Inject, Service } from "typedi";
import { PrintInterface } from "./PrintInterface";

// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work
import "./di.generated";

@Service()
class Application {
  constructor(@Inject() public printService: PrintInterface) {}
}

const instance = Container.get(Application);

instance.printService.print();
// prints "I am alive!" (InjectedExampleClass.print function)
