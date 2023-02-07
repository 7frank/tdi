# overview

This is a showcase for auto wiring dependency injection using interfaces.

Highlights: auto wiring of (generic!) interfaces to implementing services `  constructor(@AutoWireInject() public databaseService: CrudInterface<User>) {}`

It works the following:

- Run through code base and find class decorators named `@AutoWireService` and `@AutoWireInject`
- create a file `di.generated.ts`, which has to be imported manually at the entry point and which will contain import for all services

if you want to add your own services:

- name root services "Service"
- and dependent services "AutoWireService" otherwise the current import mechanism gets confused
- use `AutoWireInject` as marker decorator like ` constructor(@AutoWireInject() myService: MyInterface<MyType>) {}`

# example usage

`yarn build`
`yarn di`
`yarn build` (twice T_T, currently necessary to generate all relevant javascript files)
`node dist/index.js`, `node dist/example.js` or `node dist/test.js`

# develop

(!) internal

`yarn dev` to run the di example

`yarn di` to query for DI interfaces and update di.generated.ts file that needs to be imported at the top of your index file

# todo

- create AST transformer `di.generated.ts` automatically at the beginning of the the compiled entry point file
- change implementation to not have to build twice
- extract.ts currently contains a static string "AutoWireService",
  - move this into a global config file
  - (maybe extract from ts-config)
- order of appearance does matter. we will have to check if the dependency tree and generated works as intended
