import * as ts from "typescript";
import { factory } from "typescript";

/**
 * A transformer that searches for certain class decorators and add di logic for auto wiring.
 *
 * Resources:
 *       [ast viewer - use to identify nodes from code](https://ts-ast-viewer.com)
 *       [typescript-transformer-handbook](https://github.com/itsdouges/typescript-transformer-handbook#replacing-a-node-with-multiple-nodes)
 *       [microsoft typescript compiler guide](https://github.com/microsoft/TypeScript-wiki/blob/main/Using-the-Compiler-API.md)
 *       [turn code into program](https://learning-notes.mistermicheels.com/javascript/typescript/compiler-api/#turning-code-into-a-program)
 *
 */

export interface MyPluginOptions {
  /**
   * List of class decorators that are used for auto wiring
   */
  includedDecorators?: string[];
}

export default function myTransformerPlugin(
  program: ts.Program,
  opts: MyPluginOptions
) {
  const defaults = { includedDecorators: ["DiService"] };
  const file = program.getRootFileNames();
  console.log("parsing file with transformer plugin", file);

  opts = { ...defaults, ...opts };

  let foundRelevantDecoratorIdentifier: ts.Identifier | undefined;

  return {
    before(ctx: ts.TransformationContext) {
      return (sourceFile: ts.SourceFile) => {
        function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
          if (ts.isClassDeclaration(node)) {
            const className = node.name?.escapedText;

            const implement = node.heritageClauses
              ?.flatMap((n) => n.types.map((f) => f.getText()))
              .map(sanitize);

            const decoratorCallExpressions = ts
              .getDecorators(node)
              ?.map((d) => d.expression)
              .filter(ts.isCallExpression);

            const decoratorIdentifiers = decoratorCallExpressions
              ?.map((d) => d.expression)
              .filter(ts.isIdentifier);

            foundRelevantDecoratorIdentifier = decoratorIdentifiers?.find((n) =>
              opts?.includedDecorators?.some((d) => d == n.escapedText)
            );

            if (foundRelevantDecoratorIdentifier) {
              console.log(
                "found decorator:",
                foundRelevantDecoratorIdentifier.escapedText,
                "at class",
                className,
                "that implements",
                implement
              );

              if (!className) {
                console.warn(
                  "cannot create DI container, class name was empty"
                );
                return ts.visitEachChild(node, visitor, ctx);
              }
              //  prepend a code sequence like:  Container.set("CrudInterface<User>",InMemoryCrudService);
              // const tmp =
              //   implement?.flatMap((i) =>
              //     createDiContainerConnection(className, i)
              //   ) ?? [];

              const tmp = [];

              // const expr =
              //   foundRelevantDecoratorIdentifier.parent as ts.CallExpression;
              // return factory.updateCallExpression(
              //   expr,
              //   expr.expression,
              //   undefined,
              //   [factory.createStringLiteral(implement)]
              // );

              const diDecorators = implement?.map((n) => createDiDecorator(n));
              diDecorators?.[0];
              // Note: used deprecated version as this generates the correct output, for now
              node = factory.updateClassDeclaration(
                node,
                [...(ts.getDecorators(node) ?? []), ...(diDecorators ?? [])],
                ts.getModifiers(node),
                node.name,
                node.typeParameters,
                node.heritageClauses,
                node.members
              );

              return [ts.visitEachChild(node, visitor, ctx), ...tmp];
            }
          }
          return ts.visitEachChild(node, visitor, ctx);
        }
        // update import
        // if (foundRelevantDecorator)
        //   // TODO second parameter is ignored and we have to use a workaround for now "typedi_1"
        //   sourceFile = addDiImportDeclaration(sourceFile, "__DI", "typedi");

        return ts.visitEachChild(sourceFile, visitor, ctx);
      };
    },
  };
}

/**
 *
 * @param s remove special characters so that key in di container does match
 * @returns
 */
function sanitize(s: string) {
  return s.replace(/[^\w\s]/gi, "_");
}

function createDiDecorator(id: string) {
  // return factory.createDecorator(
  //   factory.createCallExpression(
  //     factory.createIdentifier("Service"),
  //     undefined,
  //     [factory.createStringLiteral(id)]
  //   )
  // );

  return factory.createDecorator(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier("typedi_1"),
        factory.createIdentifier("Service")
      ),
      undefined,
      [factory.createStringLiteral(id)]
    )
  );
}

function createDiContainerConnection(className: string, implement: string) {
  //const implement = "CrudInterface<User>";
  //const className = "InMemoryCrudService";
  return [
    factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("typedi_1"),
            factory.createIdentifier("Container")
          ),
          factory.createIdentifier("set")
        ),
        undefined,
        [
          factory.createStringLiteral(implement),
          factory.createIdentifier(className),
        ]
      )
    ),
  ];

  // return factory.createCallExpression(
  //   factory.createPropertyAccessExpression(
  //     factory.createPropertyAccessExpression(
  //       factory.createIdentifier("typedi_1"),
  //       factory.createIdentifier("Container")
  //     ),
  //     factory.createIdentifier("set")
  //   ),
  //   undefined,
  //   [
  //     factory.createStringLiteral(implement),
  //     factory.createCallExpression(
  //       factory.createPropertyAccessExpression(
  //         factory.createPropertyAccessExpression(
  //           factory.createIdentifier("typedi_1"),
  //           factory.createIdentifier("Container")
  //         ),
  //         factory.createIdentifier("get")
  //       ),
  //       undefined,
  //       [factory.createIdentifier(className)]
  //     ),
  //   ]
  // );
}

function addDiImportDeclaration(
  sourceFile: ts.SourceFile,
  defaultImportName: string,
  packageName: string
) {
  return factory.updateSourceFile(sourceFile, [
    factory.createImportDeclaration(
      /* modifiers */ undefined,
      factory.createImportClause(
        false,
        factory.createIdentifier(defaultImportName),
        undefined
        // factory.createNamedImports([
        //   factory.createImportSpecifier(
        //     false,
        //     undefined,
        //     factory.createIdentifier("Container")
        //   ),
        // ])
      ),
      factory.createStringLiteral(packageName)
    ),
    // Ensures the rest of the source files statements are still defined.
    ...sourceFile.statements,
  ]);
}
