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
    const serviceMetadata: ServiceMetadata<T> = {
      id: options.id || targetConstructor,
      type: targetConstructor as unknown as Constructable<T>,
      factory: (options as any).factory || undefined,
      multiple: options.multiple || false,
      eager: options.eager || false,
      // @ts-ignore
      scope: options.scope || "container",
      //   referencedBy: new Map().set(
      //     ContainerRegistry.defaultContainer.id,
      //     ContainerRegistry.defaultContainer
      //   ),
      //value: EMPTY_VALUE,
    };
    console.log(serviceMetadata);
    if (options.extends)
      Container.set(options.extends, Container.get(targetConstructor));
    else throw new Error("Wire decorator requires 'extends'");
    //  ContainerRegistry.defaultContainer.set(serviceMetadata);
  };
}

/**
 * Takes an interface and creates a dummy class, so that it is available at run time for di purposes
 */
export function defer<T>() {
  return class Dummy {} as ClassType<T>;
}
