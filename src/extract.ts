import { parse, print, visit } from "recast";
import * as ts from "recast/parsers/typescript";
import fg from "fast-glob";

import * as fs from "fs";

const stream = fg.stream(["src/**/*.ts"], { dot: true });

console.log(
  "// Note: this file must be on top of your application that uses typedi together with the Wire decorator for autowiring to work"
);

async function main() {
  for await (const entry of stream) {
    let source = await fs.promises.readFile(entry, "utf8");

    const hasFoundDecorator = parseSource(source);

    if (hasFoundDecorator) {
      // @ts-ignore
      let importPath = entry.split("/").slice(1).join("/");
      importPath = importPath.split(".").slice(0, -1).join(".");

      const importStatement = `import "./${importPath}"`;
      console.log(importStatement);
    }
  }
}

main();

function parseSource(
  source: string,
  selector = (n) => n == "Autowire" || n == "Wire" || n == "AutoWire"
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
