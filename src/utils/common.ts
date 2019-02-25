import { parse } from "@babel/parser";
import generate from "@babel/generator";
import { File, Node } from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";
import { isNumber } from "util";

export type AstSelectorResult = {
    [key: string]: Node;
};

export const compileAstSelectorScript = (
    script: string
): ((root: File) => AstSelectorResult) => {
    const selectorResults: AstSelectorResult = {};

    const astSelectorResolve = (path: NodePath) => {
        if (!path) {
            return;
        }
        selectorResults[`${path.node.start}-${path.node.end}`] = path.node;
    };

    const func = new Function("traverse", "resolve", "root", script);
    const curried = func.bind(null, traverse, astSelectorResolve);

    return (root: File) => {
        curried(root);
        return selectorResults;
    };
};

export const getAst = (fileText: string): File | undefined => {
    return parse(fileText, {
        sourceType: "module",
        plugins: [
            "jsx",
            "typescript",
            "doExpressions",
            "objectRestSpread",
            "classProperties",
            "asyncGenerators",
            "functionBind",
            "functionSent",
            "dynamicImport"
        ]
    });
};

/**
 * This method accept a source code text
 * and list of nodes.
 *
 * It takes each node and replace the portion of text in source code
 * that matches the node lines with the ast node content.
 *
 * THe nodes must be mutual exclusive of each others.
 * No node can be child of
 */
export const replaceTextWithNodes = (
    sourceCode: string,
    nodes: Node[] | undefined | null
): string => {
    if (!nodes || !sourceCode) {
        return "";
    }

    // We sort the node by start position in desceding order
    // And process from bottom of the code to top
    // so that there is no lines change when replace the text with node one-by-one
    const sortedNodesByStartDecending = nodes.sort(
        (left, right) => (right.start || 0) - (left.start || 0)
    );

    const result = sortedNodesByStartDecending.reduce(
        (prev: string, node): string => {
            if (!node || !isNumber(node.start) || !isNumber(node.end)) {
                return "";
            }
            const newText =
                prev.substring(0, node.start) +
                generate(node).code +
                prev.substring(node.end);

            return newText;
        },
        sourceCode
    );

    return result;
};
