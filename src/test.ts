import "reflect-metadata";
import { Container, Inject as DiInject, Service as DiService } from "typedi";
import "./di.generated";
import { User } from "./User";

const users: Record<number, User> = {};

// (1) the interface
export interface CrudInterface<T extends { id: number }> {
  create: (t: T) => void;
  read: (id: number) => T;
}

// (2) the service that implements the interface and that gets injected
@DiService()
export class InMemoryCrudService implements CrudInterface<User> {
  create(t: User) {
    users[t.id] = t;
  }

  read(id: number) {
    return users[id];
  }
}

// (3) the service that uses the interface
@DiService()
class Application {
  constructor(
    @DiInject() public databaseService: CrudInterface<User>,
    @DiInject() public databaseService2: CrudInterface<User>
  ) {}
}

// (4) the result
// @ts-ignore
console.log(Container.globalInstance);
const instance = Container.get(Application);
instance.databaseService.create({ id: 1, name: "Frank" });
const user = instance.databaseService.read(1);
console.log(user);
