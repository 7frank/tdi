import * as ts from "typescript";

// Note: https://ts-ast-viewer.com
//       https://github.com/microsoft/TypeScript-wiki/blob/main/Using-the-Compiler-API.md

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
  const defaults = { includedDecorators: ["AutoWire2"] };
  const file = program.getRootFileNames();
  console.log("parsing file with transformer plugin", file);

  opts = { ...defaults, ...opts };

  return {
    before(ctx: ts.TransformationContext) {
      return (sourceFile: ts.SourceFile) => {
        function visitor(node: ts.Node): ts.Node {
          if (ts.isClassDeclaration(node)) {
            const className = node.name?.escapedText;
            const implement = node.heritageClauses?.flatMap((n) =>
              n.types.map((f) => f.getText())
            );

            const decoratorNames = ts
              .getDecorators(node)
              ?.map((d) => d.expression)
              .filter(ts.isCallExpression)
              .map((d) => d.expression)
              .filter(ts.isIdentifier)
              .map((d) => d.escapedText);

            const hasRelevantDecorator = decoratorNames?.find((n) =>
              opts?.includedDecorators?.some((d) => d == n)
            );

            if (hasRelevantDecorator) {
              console.log(decoratorNames, className, implement);

              // Container.set("CrudInterface<User>",InMemoryCrudService);

              const tmp = ts.factory.createEmptyStatement();
              return ts.factory.createBlock([tmp, node]);
            }

            // const target = node.arguments[0];
            // if (ts.isPropertyAccessExpression(target)) {
            //   return ts.createBinary(
            //     target.expression,
            //     ts.SyntaxKind.AmpersandAmpersandToken,
            //     target
            //   );
            // }
          }
          return ts.visitEachChild(node, visitor, ctx);
        }
        return ts.visitEachChild(sourceFile, visitor, ctx);
      };
    },
  };
}
