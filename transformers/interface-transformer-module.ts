import * as ts from "typescript";
import { factory } from "typescript";
import { sanitize } from "./sanitize";
import * as fs from "fs";

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
  includedClassDecorators?: string[];
  includedFunctionDecorators?: string[];
}

export default function myTransformerPlugin(
  program: ts.Program,
  opts: MyPluginOptions
) {
  const defaults: Partial<MyPluginOptions> = {
    includedClassDecorators: ["AutoWireService"],
    includedFunctionDecorators: ["AutoWireInject"],
  };
  const file = program.getRootFileNames();
  console.log("parsing file with transformer plugin", file);

  opts = { ...defaults, ...opts };

  let foundRelevantDecoratorIdentifier: ts.Identifier | undefined;

  return {
    before(ctx: ts.TransformationContext) {
      return (sourceFile: ts.SourceFile) => {
        function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
          /**
           * find "inject" decorators and insert service name
           */
          if (ts.isConstructorDeclaration(node)) {
            const newParameters = node.parameters.map((param) => {
              // we can only inject if we have a type
              if (param.type) {
                const serviceName = sanitize(param.type.getText());

                const decoratorCallExpressions = ts
                  .getDecorators(param)
                  ?.map((d) => d.expression)
                  .filter(ts.isCallExpression);

                const decoratorIdentifiers = decoratorCallExpressions
                  ?.map((d) => d.expression)
                  .filter(ts.isIdentifier);

                const foundFunctionDeclaration = decoratorIdentifiers?.find(
                  (n) =>
                    opts?.includedFunctionDecorators?.some(
                      (d) => d == n.escapedText
                    )
                );

                if (foundFunctionDeclaration) {
                  const decoratorImportName =
                    foundFunctionDeclaration.escapedText.toString();

                  const diFunctionDecorators = [serviceName]?.map((n) =>
                    createDiDecorator(decoratorImportName, n)
                  );

                  const dec = [
                    // TODO we only want to replace the previous "inject" not throw away all other decorators as well
                    // ...(ts.getDecorators(param) ?? []),
                    ...(diFunctionDecorators ?? []),
                  ];

                  // TODO update param decorator otherwise nothing will work
                  // Note: used deprecated version as this generates the correct output, for now
                  param = factory.updateParameterDeclaration(
                    param,
                    dec,
                    ts.getModifiers(param),
                    param.dotDotDotToken,
                    param.name,
                    param.questionToken,
                    param.type,
                    param.initializer
                  );

                  /**
                   * log inject dependencies
                   */
                  const targetClassName = (
                    node.parent as ts.ClassDeclaration
                  ).name?.escapedText.toString()!;
                  logDependencies(
                    sourceFile.fileName,
                    targetClassName,
                    serviceName,
                    "inject"
                  );

                  console.log(
                    "found function decorator",
                    decoratorImportName,
                    " injecting",
                    serviceName,
                    " at constructor for class",
                    targetClassName
                  );
                }
              }
              return param;
            });

            // Note: used deprecated version as this generates the correct output, for now
            node = factory.updateConstructorDeclaration(
              node,
              ts.getModifiers(node),
              newParameters,
              node.body
            );

            return ts.visitEachChild(node, visitor, ctx);
          }

          /**
           * find "service" decorators and insert service name.
           * useful for `implements <interface>` and `implements <genericInterface<Type>>` situations
           */
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
              opts?.includedClassDecorators?.some((d) => d == n.escapedText)
            );

            if (foundRelevantDecoratorIdentifier) {
              const foundClassDecoratorName =
                foundRelevantDecoratorIdentifier.escapedText.toString();
              console.log(
                "found decorator:",
                foundClassDecoratorName,
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

              const diDecorators = implement?.map((n) =>
                createDiDecorator(foundClassDecoratorName, n)
              );

              /**
               * log class dependencies
               */
              implement?.forEach((n) => {
                logDependencies(sourceFile.fileName, className, n, "service");
              });

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

              return ts.visitEachChild(node, visitor, ctx);
            }
          }
          return ts.visitEachChild(node, visitor, ctx);
        }
        return ts.visitEachChild(sourceFile, visitor, ctx);
      };
    },
  };
}

function logDependencies(
  fileName: string,
  id: string,
  parent: string,
  type: "service" | "inject"
) {
  const len = process.cwd().split("/").length;
  const relativeImport =
    "./" +
    fileName
      .split("/")
      .slice(len + 1)
      .join("/");

  fs.appendFileSync(
    "./dependencies.log",
    JSON.stringify({
      // TODO import path differes between inject and service
      import: relativeImport,
      id,
      parent,
      type,
    }) + "\n"
  );
}

function createDiDecorator(name: string, id: string) {
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
        factory.createIdentifier("helper_1"),
        factory.createIdentifier(name)
      ),
      undefined,
      [factory.createStringLiteral(id)]
    )
  );
}
