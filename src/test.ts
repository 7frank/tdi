import "reflect-metadata";
import { Container, Inject, Service } from "typedi";
import "./di.generated";
import { User } from "./User";
import AutoWire2 from "./di-utils";

const users: Record<number, User> = {};

// (1) the interface
export interface CrudInterface<T extends { id: number }> {
  create: (t: T) => void;
  read: (id: number) => T;
}

// (2) the service that implements the interface and that gets injected
@AutoWire2() // { extends: CrudInterface }
@Service()
export class InMemoryCrudService implements CrudInterface<User> {
  create(t: User) {
    users[t.id] = t;
  }

  read(id: number) {
    return users[id];
  }
}

// (3) the service that uses the interface
@Service()
class Application {
  constructor(@Inject() public databaseService: CrudInterface<User>) {}
}

// (4) the result
const instance = Container.get(Application);
instance.databaseService.create({ id: 1, name: "Frank" });
const user = instance.databaseService.read(1);
console.log(user);
