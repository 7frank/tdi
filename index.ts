import "reflect-metadata";
import { Container, Inject, Service, ContainerInstance } from "typedi";
import { defer, Wire } from "./di-utils";

/*****************************************/

interface PrinterService {
  print: () => void;
}

const PrinterService = defer<PrinterService>();

@Wire({ extends: PrinterService })
@Service()
class InjectedExampleClass implements PrinterService {
  print() {
    console.log("I am alive!");
  }
}

@Service()
class ExampleClass {
  @Inject()
  // @ts-ignore
  withDecorator: PrinterService;

  // @ts-ignore
  withoutDecorator: InjectedExampleClass;
}

// the code where you setup the ContainerInstance
//Container.set(Printer, Container.get(InjectedExampleClass));

const instance = Container.get(ExampleClass);

/**
 * The `instance` variable is an ExampleClass instance with the `withDecorator`
 * property containing an InjectedExampleClass instance and `withoutDecorator`
 * property being undefined.
 */
console.log(instance);

instance.withDecorator.print();
// prints "I am alive!" (InjectedExampleClass.print function)
console.log(instance.withoutDecorator);
// logs undefined, as this property was not marked with an @Inject decorator
