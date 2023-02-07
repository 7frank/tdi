import "reflect-metadata";
import "./di.generated";
import { Container, Service } from "typedi";
import { AutoWireInject } from "./helper";
import { CrudInterface } from "./interfaces/CrudInterface";
import { User } from "./interfaces/User";

@Service()
class Application {
  constructor(@AutoWireInject() public databaseService: CrudInterface<User>) {}
}

const instance = Container.get(Application);
instance.databaseService.create({ id: 1, name: "Frank" });
console.log("user created");
const user = instance.databaseService.read(1);
console.log("user:");
console.log(user);
