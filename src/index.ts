import "reflect-metadata";
import { Container, Inject, Service, ContainerInstance } from "typedi";
import { PrintInterface } from "./PrintInterface";

// Note: we would need a babel plugin that would traverse our code base and take all files with a "@Wire" decorator and prepend them to the index.js file to have a proper auto wiring
import "./BasicPrintService";

@Service()
class Application {
  constructor(@Inject() public printService: PrintInterface) {}
}

const instance = Container.get(Application);

instance.printService.print();
// prints "I am alive!" (InjectedExampleClass.print function)
