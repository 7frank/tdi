# overview

This is a showcase for auto wiring dependency injection using interfaces.

It works the following:

- Run through code base and find class decorators named `@AutoWireService` and `@AutoWireInject` and create a file di.generated.ts, which has to be imported manually at the entry file.

# develop

`yarn dev` to run the di example

`yarn di` to query for DI interfaces and update di.generated.ts file that needs to be imported at the top of your index file

# todo

- create AST transformer `di.generated.ts` automatically at the beginning of the the compiled entry point file
- change implementation to not have to build twice

# example usage

`yarn build`
`yarn di`
`yarn build` (twice T_T, currently necessary to generate all relevant javascript files)
`node dist/index.js` or `node dist/test.js`

# todo

- extract.ts currently contains a static string "AutoWireService",
  - move this into a global config file
  - (maybe extract from ts-config)
- order of appearance does matter. we will have to create a dependency tree and generate the imports from there.
  - This currently be done, by logging the dependencies in the transformer
    - but might require compiling twice this way

# notes

- name root services "Service" and dependent services "AutoWireService" otherwise the current import mechanism gets confused
