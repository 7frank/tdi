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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSource = void 0;
const recast_1 = require("recast");
const ts = __importStar(require("recast/parsers/typescript"));
function parseSource(source, selector = (n) => n == "AutoWireService") {
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
exports.parseSource = parseSource;
