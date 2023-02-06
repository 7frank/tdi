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
    ...n,
    //     type: n.type,
    //     parent: n.parent,
    //     id: n.id,
  }));

  // console.log(json2);

  const t = runDependencyTree(json2);

  console.log(
    `/**
* Generated file - do not edit
* 
* This file contains dependencies for DI auto wiring mechanism to work
* (generate anew by running  "yarn di" )
*/`
  );
  t.forEach((importPath) => {
    importPath = importPath.split(".").slice(0, -1).join(".");

    const importStatement = `import "./${importPath}"`;
    console.log(importStatement);
  });
}

main();

function runDependencyTree(
  json2: {
    //...n,
    type: "service" | "inject";
    parent: string;
    id: string;
  }[]
) {
  const tree = arrayToTree(json2, {
    parentProperty: "parent",
    customID: "id",
  });
  //  console.log("tree:", JSON.stringify(tree, null, "  "));

  const { breadthSync } = require("tree-traversal");

  const topToBottom: any[] = [];
  breadthSync(tree[0], {
    subnodesAccessor: function (node) {
      return node.children ?? [];
    },

    // Function called for each node in the tree.
    // Tree traversal continues when this callback returns.
    onNode: function (node, userdata) {
      //  console.log(node.id);

      topToBottom.push(node);
      return true;
    },
  });

  const importNames = topToBottom
    .reverse()
    .filter((n) => n.parent)
    .map((n) => n.import);

  return [...new Set(importNames)];
}
