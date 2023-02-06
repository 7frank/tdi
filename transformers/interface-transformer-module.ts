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
  const defaults = { includedDecorators: ["AutoWire2", "Service"] };
  const file = program.getRootFileNames();
  console.log("parsing file with transformer plugin", file);

  opts = { ...defaults, ...opts };

  let foundRelevantDecorator: ts.__String | undefined;

  return {
    before(ctx: ts.TransformationContext) {
      return (sourceFile: ts.SourceFile) => {
        function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
          if (ts.isClassDeclaration(node)) {
            const className = node.name?.escapedText;

            const implement = node.heritageClauses
              ?.flatMap((n) => n.types.map((f) => f.getText()))
              .map(sanitize);

            const decoratorNames = ts
              .getDecorators(node)
              ?.map((d) => d.expression)
              .filter(ts.isCallExpression)
              .map((d) => d.expression)
              .filter(ts.isIdentifier)
              .map((d) => d.escapedText);

            foundRelevantDecorator = decoratorNames?.find((n) =>
              opts?.includedDecorators?.some((d) => d == n)
            );

            if (foundRelevantDecorator) {
              console.log(
                "found decorator:",
                foundRelevantDecorator,
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
              const tmp =
                implement?.flatMap((i) =>
                  createDiContainerConnection(className, i)
                ) ?? [];

              return [ts.visitEachChild(node, visitor, ctx), ...tmp];
            }
          }
          return ts.visitEachChild(node, visitor, ctx);
        }
        // update import
        if (foundRelevantDecorator)
          // TODO second parameter is ignored and we have to use a workaround for now "typedi_1"
          sourceFile = addDiImportDeclaration(sourceFile, "__DI", "typedi");

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
