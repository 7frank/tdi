import fg from "fast-glob";

import * as fs from "fs";
import { parseSource } from "./parseSource";

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
