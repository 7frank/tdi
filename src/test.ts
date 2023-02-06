import "reflect-metadata";
import { Container, Inject as DiInject, Service as DiService } from "typedi";
import { CrudInterface } from "./CrudInterface";
import "./di.generated";
import { User } from "./User";

// (3) the service that uses the interface
@DiService()
class Application {
  constructor(@DiInject() public databaseService: CrudInterface<User>) {}
}

// (4) the result
// @ts-ignore
console.log(Container.globalInstance);
const instance = Container.get(Application);
instance.databaseService.create({ id: 1, name: "Frank" });
const user = instance.databaseService.read(1);
console.log(user);
