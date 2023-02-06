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
exports.InMemoryCrudService = void 0;
require("reflect-metadata");
const typedi_1 = require("typedi");
require("./di.generated");
const users = {};
// (2) the service that implements the interface and that gets injected
let InMemoryCrudService = class InMemoryCrudService {
    create(t) {
        users[t.id] = t;
    }
    read(id) {
        return users[id];
    }
};
InMemoryCrudService = __decorate([
    (0, typedi_1.Service)(),
    typedi_1.Service("CrudInterface_User_")
], InMemoryCrudService);
exports.InMemoryCrudService = InMemoryCrudService;
// (3) the service that uses the interface
let Application = class Application {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
};
Application = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)("CrudInterface_User_")),
    __metadata("design:paramtypes", [Object])
], Application);
// (4) the result
// @ts-ignore
console.log(typedi_1.Container.globalInstance);
const instance = typedi_1.Container.get(Application);
instance.databaseService.create({ id: 1, name: "Frank" });
const user = instance.databaseService.read(1);
console.log(user);
