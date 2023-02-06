# overview

This is a showcase for auto wiring dependency injection using interfaces.

It works the following:

- Run through code base and find class decorators named `@AutoWire` and create a file di.generated.ts, which currently has to be imported manually.
- a function `defer` that creates a dummy class for the interfaces defined to be used for the DI step

# develop

`yarn dev` to run the di example

`yarn di` to query for DI interfaces and update di.generated.ts file that needs to be imported at the top of your index file

# todo

- create AST transformer that parses for AutoWire and prepend `di.generated.ts` automatically at the beginning of the the compiled entry point file
- create transformer that would make "defer()" redundant

# example usage

`yarn di`
`yarn build`
`node dist/index.js`
