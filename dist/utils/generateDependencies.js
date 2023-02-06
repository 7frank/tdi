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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
var arrayToTree = require("array-to-tree");
/** work in progress - generate dependency tree from auto wired services */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const deps = fs.readFileSync(path.resolve(process.cwd(), "dependencies.log"), {
            encoding: "utf-8",
        });
        const jsonString = "[" +
            deps
                .split("\n")
                .filter((n) => n)
                .join(",") +
            "]";
        const json = JSON.parse(jsonString);
        let services = json.filter((n) => n.type == "service");
        let injects = json.filter((n) => n.type == "inject");
        //   { type: 'service', parent: 'NestedInterface', id: 'NestedChildService'  }
        // + { type: 'inject' , parent: 'NestedInterface', id: 'BasicPrintService' }
        //
        // = { type: 'meta' , parent: 'NestedChildService', id: 'BasicPrintService' }
        // replace previous parent with new parent
        const servicesNew = services.map(function (s) {
            var _a;
            let res = Object.assign({}, s);
            const _id = (_a = injects.find((i) => i.parent == s.parent)) === null || _a === void 0 ? void 0 : _a.id;
            if (_id) {
                res.parent = _id;
            }
            return res;
        });
        const servicesInverted = services.map((i) => (Object.assign(Object.assign({}, i), { parent: i.id, id: i.parent })));
        const root = {
            // @ts-ignore
            parent: null,
            id: "Application",
            type: "service",
        };
        const json2 = [root, ...servicesNew, ...servicesInverted].map((n) => (Object.assign({}, n)));
        // console.log(json2);
        const t = runDependencyTree(json2);
        console.log(`/**
* Generated file - do not edit
* 
* This file contains dependencies for DI auto wiring mechanism to work
* (generate anew by running  "yarn di" )
*/`);
        t.forEach((importPath) => {
            importPath = importPath.split(".").slice(0, -1).join(".");
            const importStatement = `import "./${importPath}"`;
            console.log(importStatement);
        });
    });
}
main();
function runDependencyTree(json2) {
    const tree = arrayToTree(json2, {
        parentProperty: "parent",
        customID: "id",
    });
    //  console.log("tree:", JSON.stringify(tree, null, "  "));
    const { breadthSync } = require("tree-traversal");
    const topToBottom = [];
    breadthSync(tree[0], {
        subnodesAccessor: function (node) {
            var _a;
            return (_a = node.children) !== null && _a !== void 0 ? _a : [];
        },
        // Function called for each node in the tree.
        // Tree traversal continues when this callback returns.
        onNode: function (node, userdata) {
            //  console.log(node.id);
            topToBottom.push(node);
            return true;
        },
    });
    const importNames = topToBottom
        .reverse()
        .filter((n) => n.parent)
        .map((n) => n.import);
    return [...new Set(importNames)];
}
