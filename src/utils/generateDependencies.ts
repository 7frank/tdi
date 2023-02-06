import * as fs from "fs";
import * as path from "path";
import LTT from "list-to-tree";
/** work in progress - generate dependency tree from auto wired services */

async function main() {
  const deps = fs.readFileSync(
    path.resolve(process.cwd(), "dependencies.log"),
    {
      encoding: "utf-8",
    }
  );

  const jsonString =
    "[" +
    deps
      .split("\n")
      .filter((n) => n)
      .join(",") +
    "]";

  const json: {
    id: string;
    parent: string;
    type: "services" | "inject";
    import: string;
  }[] = JSON.parse(jsonString);

  const json2 = json.map((n) => ({
    //...n,
    type: n.type,
    parent: n.parent,
    id: n.id,
  }));

  console.log("JSON", json2);
  const ltt = new LTT(json2);
  var tree = ltt.GetTree();

  console.log(tree);
}

main();
