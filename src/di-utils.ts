import {
  Constructable,
  Container,
  ServiceMetadata,
  ServiceOptions,
} from "typedi";

export interface ClassType<T = any> {
  new (...args: any[]): T;
}

export function Wire<T, S>(
  options: ServiceOptions<T> & { extends?: Constructable<S> } = {}
): ClassDecorator {
  return (targetConstructor) => {
    if (options.extends)
      Container.set(options.extends, Container.get(targetConstructor));
    else throw new Error("Wire decorator requires 'extends'");
  };
}

/**
 * Takes an interface and creates a dummy class, so that it is available at run time for di purposes
 */
export function defer<T>() {
  return class Dummy {} as ClassType<T>;
}

// export as default to make it a bit easier to rename in case we want to change the decorator name in the future
export default Wire;
