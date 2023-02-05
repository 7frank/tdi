# overview

this would be a showcase for auto wiring dependency injection using interfaces.

But that would require two babel plugins:

- one run through code base and find @Wire adecorators, create dependencies.js or prepend them at the beginning of the the compiled entry point file
- maybe a second plugin that would make "defer()" redundant

# develop

`ts-node src/index.ts` to run the di example

`yarn di` to query for DI interfaces and update di.generated.ts file that needs to be imported at the top of your index file
