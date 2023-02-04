import "reflect-metadata";
import { Container, Inject, Service, ContainerInstance } from "typedi";
import { defer, Wire } from "./di-utils";

interface PrintInterface {
  print: () => void;
}

const PrintInterface = defer<PrintInterface>();

@Wire({ extends: PrintInterface })
@Service()
class BasicPrintService implements PrintInterface {
  print() {
    console.log("I am alive!");
  }
}

@Service()
class Application {
  @Inject()
  // @ts-ignore
  printService: PrintInterface;
}

const instance = Container.get(Application);

instance.printService.print();
// prints "I am alive!" (InjectedExampleClass.print function)
