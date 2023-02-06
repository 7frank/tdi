import { parse, visit } from "recast";
import * as ts from "recast/parsers/typescript";

export function parseSource(
  source: string,
  selector = (n) => n == "AutoWireService"
) {
  const ast = parse(source, { parser: ts });
  let hasFound = false;

  visit(ast, {
    visitClassDeclaration(path) {
      const className = path.value.id.name;
      const implement = path.value.implements?.map((n) => n.expression.name);

      const decorators = path.value.decorators.map(
        (n) => n.expression.callee.name
      );

      const found = decorators.find(selector);
      if (found) {
        console.log(
          "// Found match with",
          found,
          "in decorators",
          decorators,
          "of class",
          className,
          "that implements",
          implement
        );
        hasFound = true;
        return false;
      }

      this.traverse(path);
    },
  });
  return hasFound;
}
