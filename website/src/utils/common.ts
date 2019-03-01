import { parseNoPatch } from "babel-eslint";
import generate from "@babel/generator";
import { Node } from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";
import { isNumber } from "util";
import { IParserAdapter } from "../parser-adapters/js/babel-eslint";

export type AstSelectorResult = Node[];

export const compileAstSelectorScript = (
    script: string,
    parserAdapter: IParserAdapter
): ((sourceCode: string) => AstSelectorResult) => {
    const selectorResults: AstSelectorResult = [];

    const astSelectorResolve = (node: Node) => {
        if (!node) {
            return;
        }
        selectorResults.push(node);
    };

    const func = new Function("parser", "resolve", "sourceCode", script);
    const curried = func.bind(null, parserAdapter, astSelectorResolve);

    return (code: string) => {
        curried(code);
        return selectorResults;
    };
};

export const findNodeByRowCol = ({ row, col }: { row: number; col: number }, root: NodePath) => {
    if (root.node.loc) {
    }
    return null;
};

export const getAst = (fileText: string): Node | undefined => {
    return parseNoPatch(fileText, {
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
export const replaceTextWithNodes = (sourceCode: string, nodes: Node[] | undefined | null): string => {
    if (!nodes || !sourceCode) {
        return "";
    }

    // We sort the node by start position in desceding order
    // And process from bottom of the code to top
    // so that there is no lines change when replace the text with node one-by-one
    const sortedNodesByStartDecending = nodes.sort((left, right) => (right.start || 0) - (left.start || 0));

    const result = sortedNodesByStartDecending.reduce((prev: string, node): string => {
        if (!node || !isNumber(node.start) || !isNumber(node.end)) {
            return "";
        }
        const newText = prev.substring(0, node.start) + generate(node).code + prev.substring(node.end);

        return newText;
    }, sourceCode);

    return result;
};
