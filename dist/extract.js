"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recast_1 = require("recast");
const ts = __importStar(require("recast/parsers/typescript"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs = __importStar(require("fs"));
const stream = fast_glob_1.default.stream(["src/**/*.ts"], { dot: true });
console.log("// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work");
function main() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a;) {
                _c = stream_1_1.value;
                _d = false;
                try {
                    const entry = _c;
                    let source = yield fs.promises.readFile(entry, "utf8");
                    const hasFoundDecorator = parseSource(source);
                    if (hasFoundDecorator) {
                        // @ts-ignore
                        let importPath = entry.split("/").slice(1).join("/");
                        importPath = importPath.split(".").slice(0, -1).join(".");
                        const importStatement = `import "./${importPath}"`;
                        console.log(importStatement);
                    }
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
main();
function parseSource(source, selector = (n) => n == "Autowire" || n == "Wire" || n == "AutoWire") {
    const ast = (0, recast_1.parse)(source, { parser: ts });
    let hasFound = false;
    (0, recast_1.visit)(ast, {
        visitClassDeclaration(path) {
            var _a;
            const className = path.value.id.name;
            const implement = (_a = path.value.implements) === null || _a === void 0 ? void 0 : _a.map((n) => n.expression.name);
            const decorators = path.value.decorators.map((n) => n.expression.callee.name);
            const found = decorators.find(selector);
            if (found) {
                console.log("// Found match with", found, "in decorators", decorators, "of class", className, "that implements", implement);
                hasFound = true;
                return false;
            }
            this.traverse(path);
        },
    });
    return hasFound;
}
