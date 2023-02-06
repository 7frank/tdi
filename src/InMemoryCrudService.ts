import { CrudInterface } from "./CrudInterface";
import { AutoWireService } from "./helper";
import { User } from "./User";

const users: Record<number, User> = {};

@AutoWireService()
export class InMemoryCrudService implements CrudInterface<User> {
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
