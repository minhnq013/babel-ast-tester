declare module "babel-eslint" {
    import { Node } from "@babel/types";
    export function parse(code: String, options: any): Node;
    export function parseForESLint(code: any, options: any): any;
    export function parseNoPatch(code: any, options: any): any;
}
