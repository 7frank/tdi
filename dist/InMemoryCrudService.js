"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCrudService = void 0;
const typedi_1 = require("typedi");
const CrudInterface_1 = require("./CrudInterface");
const di_utils_1 = __importDefault(require("./di-utils"));
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
    (0, di_utils_1.default)({ extends: CrudInterface_1.CrudInterface }),
    (0, typedi_1.Service)()
], InMemoryCrudService);
exports.InMemoryCrudService = InMemoryCrudService;
