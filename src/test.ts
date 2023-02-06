import "reflect-metadata";
import { Container } from "typedi";
import { CrudInterface } from "./CrudInterface";
import "./di.generated";
import { AutoWireInject, AutoWireService } from "./helper";
import { User } from "./User";

// (3) the service that uses the interface
@AutoWireService()
class Application {
  constructor(@AutoWireInject() public databaseService: CrudInterface<User>) {}
}

// (4) the result
// @ts-ignore
console.log(Container.globalInstance);
const instance = Container.get(Application);
instance.databaseService.create({ id: 1, name: "Frank" });
const user = instance.databaseService.read(1);
console.log(user);
