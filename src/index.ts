// Note: must be imported once, for di mechanism to work
import "reflect-metadata";
// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work
import "./di.generated";
import { Container, Service } from "typedi";
import { PrintInterface } from "./interfaces/PrintInterface";

import { CrudInterface } from "./interfaces/CrudInterface";
import { User } from "./interfaces/User";
import { AutoWireService, AutoWireInject } from "./helper";

@Service()
class Application {
  constructor(
    @AutoWireInject() public printService: PrintInterface,
    @AutoWireInject() public databaseService: CrudInterface<User>
  ) {}
}

const instance = Container.get(Application);

instance.databaseService.create({ id: 1, name: "Frank" });
console.log("user created");
const user = instance.databaseService.read(1);
instance.printService.print(JSON.stringify(user));
