"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = exports.Wire = void 0;
const typedi_1 = require("typedi");
function Wire(options = {}) {
    return (targetConstructor) => {
        if (options.extends)
            typedi_1.Container.set(options.extends, typedi_1.Container.get(targetConstructor));
        else
            throw new Error("Wire decorator requires 'extends'");
    };
}
exports.Wire = Wire;
/**
 * Takes an interface and creates a dummy class, so that it is available at run time for di purposes
 */
function defer() {
    return class Dummy {
    };
}
exports.defer = defer;
// export as default to make it a bit easier to rename in case we want to change the decorator name in the future
exports.default = Wire;
