"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
require("reflect-metadata");
var typedi_1 = require("typedi");
var InjectedExampleClass = /** @class */ (function () {
    function InjectedExampleClass() {
    }
    InjectedExampleClass.prototype.print = function () {
        console.log("I am alive!");
    };
    InjectedExampleClass = __decorate([
        (0, typedi_1.Service)()
    ], InjectedExampleClass);
    return InjectedExampleClass;
}());
var ExampleClass = /** @class */ (function () {
    function ExampleClass() {
    }
    __decorate([
        (0, typedi_1.Inject)()
    ], ExampleClass.prototype, "withDecorator");
    ExampleClass = __decorate([
        (0, typedi_1.Service)()
    ], ExampleClass);
    return ExampleClass;
}());
// const instance = Container.get(ExampleClass);
// /**
//  * The `instance` variable is an ExampleClass instance with the `withDecorator`
//  * property containing an InjectedExampleClass instance and `withoutDecorator`
//  * property being undefined.
//  */
// console.log(instance);
// instance.withDecorator.print();
// // prints "I am alive!" (InjectedExampleClass.print function)
// console.log(instance.withoutDecorator);
// // logs undefined, as this property was not marked with an @Inject decorator
