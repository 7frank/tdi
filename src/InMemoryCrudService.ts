import { Service } from "typedi";
import { CrudInterface } from "./CrudInterface";
import AutoWire from "./di-utils";
import { User } from "./User";

const users: Record<number, User> = {};

@AutoWire({ extends: CrudInterface })
@Service()
class InMemoryCrudService implements CrudInterface<User> {
  create(t: User) {
    users[t.id] = t;
  }

  read(id: number) {
    return users[id];
  }
  update(t: { id: number } & Partial<User>) {
    users[t.id] = { ...users[t.id], ...t };
  }

  delete(id: number) {
    delete users[id];
    return true;
  }
}
