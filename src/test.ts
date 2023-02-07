import "reflect-metadata";
import "./di.generated";
import Container, { Service } from "typedi";
import { PrintInterface } from "./interfaces/PrintInterface";
import { AutoWireInject } from "./helper";

import { describe, it } from "node:test";
import assert from "node:assert";

@Service()
class Application {
  constructor(@AutoWireInject() public printService: PrintInterface) {}
}

const dummyPrinter = new (class Dummy {
  print() {
    console.log("it works");
  }
})();

describe("testing dependency injection", () => {
  it("should work when using auto wiring & dependency injection", () => {
    const testee = Container.get(Application);

    assert.doesNotThrow(() => {
      testee.printService.print();
    }, Error);
  });

  it("should work when manually passing param", () => {
    const testee = new Application(dummyPrinter);

    assert.doesNotThrow(() => {
      testee.printService.print();
    }, Error);
  });

  it("should fail if no value is passed", () => {
    const testee = new Application(undefined as any);

    assert.throws(() => {
      testee.printService.print();
    }, Error);
  });
});
