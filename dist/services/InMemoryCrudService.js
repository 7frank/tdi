"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCrudService = void 0;
const helper_1 = require("../helper");
const users = {};
let InMemoryCrudService = class InMemoryCrudService {
    create(t) {
        users[t.id] = t;
    }
    read(id) {
        return users[id];
    }
    update(t) {
        users[t.id] = Object.assign(Object.assign({}, users[t.id]), t);
    }
    delete(id) {
        delete users[id];
        return true;
    }
};
InMemoryCrudService = __decorate([
    (0, helper_1.AutoWireService)(),
    helper_1.AutoWireService("CrudInterface_User_")
], InMemoryCrudService);
exports.InMemoryCrudService = InMemoryCrudService;
