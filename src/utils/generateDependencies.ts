import * as fs from "fs";
import * as path from "path";

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

  let json = JSON.parse(jsonString);

  json = json.map((n) => ({
    ...n,
    parentId: n.extends,
    id: n.class,
    childNodes: [],
  }));

  console.log("JSON", json);
  const t = createDataTree(json);
  console.log(t);
}

main();

function createDataTree(dataset) {
  const hashTable = Object.create(null);
  dataset.forEach(
    (aData) => (hashTable[aData.Id] = { ...aData, childNodes: [] })
  );
  const dataTree = [];
  dataset.forEach((aData) => {
    if (aData.parentId) {
      if (hashTable[aData.parentId])
        hashTable[aData.parentId].childNodes.push(hashTable[aData.Id]);
    } else dataTree.push(hashTable[aData.Id]);
  });
  return dataTree;
}
