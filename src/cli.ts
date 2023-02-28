import minimist from "minimist";
import * as Eta from "eta";
import { camelCase, capitalCase } from "change-case";
import * as fs from "fs/promises";

const args = minimist(process.argv.slice(2), {
  default: {
    type: "",
  },
});
const data: { [key: string]: any } = {
  utils: {
    camelCase,
    capitalCase,
  },
};
const asArray = ["props", "solidImports", "imports", "signals", "propsUnion"];

for (const key in args) {
  if (Object.prototype.hasOwnProperty.call(args, key)) {
    if (key === "_") {
      data.name = args["_"][0];
    } else {
      data[camelCase(key)] =
        asArray.includes(key) && typeof args[key] === "string"
          ? [args[key]]
          : args[key];
    }
  }
}

switch (data.type) {
  case "parent":
    data.type = "Parent";
  case "Parent":
    if (data.propsUnion === undefined) {
      data.propsUnion = [];
    }
    data.propsUnion.push("ParentProps");
    if (data.solidImports === undefined) {
      data.solidImports = [];
    }
    data.solidImports.push("ParentProps");
    break;
  case "flow":
    data.type = "Flow";
  case "Flow":
    if (data.propsUnion === undefined) {
      data.propsUnion = [];
    }
    data.propsUnion.push("FlowProps");
    if (data.solidImports === undefined) {
      data.solidImports = [];
    }
    data.solidImports.push("ParentProps");
    break;

  default:
    break;
}

if (data.signals !== undefined) {
  if (data.solidImports === undefined) {
    data.solidImports = [];
  }
  data.solidImports.push("createSignal");
}

fs.readFile("templates/component.eta", "utf-8").then((template) => {
  console.log(Eta.render(template, data));
});
