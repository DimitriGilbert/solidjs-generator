"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const Eta = __importStar(require("eta"));
const change_case_1 = require("change-case");
const fs = __importStar(require("fs/promises"));
const args = (0, minimist_1.default)(process.argv.slice(2), {
    default: {
        type: "",
    },
});
const data = {
    utils: {
        camelCase: change_case_1.camelCase,
        capitalCase: change_case_1.capitalCase,
    },
};
const asArray = ["props", "solidImports", "imports", "signals", "propsUnion"];
for (const key in args) {
    if (Object.prototype.hasOwnProperty.call(args, key)) {
        if (key === "_") {
            data.name = args["_"][0];
        }
        else {
            data[(0, change_case_1.camelCase)(key)] =
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
