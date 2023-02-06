"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const PrintInterface_1 = require("./PrintInterface");
// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work
require("./di.generated");
const CrudInterface_1 = require("./CrudInterface");
let Application = class Application {
    constructor(printService, databaseService // Note: we do currently have no type checks for template parameters,
    ) {
        this.printService = printService;
        this.databaseService = databaseService;
    }
};
Application = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)()),
    __param(1, (0, typedi_1.Inject)()),
    __metadata("design:paramtypes", [PrintInterface_1.PrintInterface,
        CrudInterface_1.CrudInterface])
], Application);
const instance = typedi_1.Container.get(Application);
instance.printService.print();
// prints "I am alive!" (InjectedExampleClass.print function)
instance.databaseService.create({ id: 1, name: "Frank" });
const user = instance.databaseService.read(1);
console.log(user);
const dummyPrinter = new (class Dummy {
    print() {
        console.log("Not injected");
    }
})();
// not injected, good for testing
const testee = new Application(dummyPrinter, null);
testee.printService.print();