import * as fs from "fs";
import * as path from "path";

var arrayToTree = require("array-to-tree");

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

  type LogEntry = {
    id: string;
    parent: string;
    type: "service" | "inject";
    import: string;
  };

  const json: LogEntry[] = JSON.parse(jsonString);

  let services = json.filter((n) => n.type == "service");
  let injects = json.filter((n) => n.type == "inject");

  //   { type: 'service', parent: 'NestedInterface', id: 'NestedChildService'  }
  // + { type: 'inject' , parent: 'NestedInterface', id: 'BasicPrintService' }
  //
  // = { type: 'meta' , parent: 'NestedChildService', id: 'BasicPrintService' }

  // replace previous parent with new parent
  const servicesNew = services.map(function (s) {
    let res = { ...s };
    const _id = injects.find((i) => i.parent == s.parent)?.id;
    if (_id) {
      res.parent = _id;
    }
    return res;
  });
  const servicesInverted = services.map((i) => ({
    ...i,
    parent: i.id,
    id: i.parent,
  }));

  const root: LogEntry = {
    // @ts-ignore
    parent: null,
    id: "Application",
    type: "service",
  };

  const json2 = [root, ...servicesNew, ...servicesInverted].map((n) => ({
    //...n,
    type: n.type,
    parent: n.parent,
    id: n.id,
  }));

  // console.log(json2);

  const tree = arrayToTree(json2, {
    parentProperty: "parent",
    customID: "id",
  });
  console.log("tree:", JSON.stringify(tree, null, "  "));
}

main();
