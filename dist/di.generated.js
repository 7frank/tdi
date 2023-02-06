"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work
// Found match with AutoWireService in decorators [ 'AutoWireService' ] of class BasicPrintService that implements [ 'PrintInterface' ]
require("./services/BasicPrintService");
// Found match with AutoWireService in decorators [ 'AutoWireService' ] of class InMemoryCrudService that implements [ 'CrudInterface' ]
require("./services/InMemoryCrudService");
