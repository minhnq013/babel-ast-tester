import defaultParserInterface from "./utils/defaultESTreeParserInterface";

const ID = "babel-eslint";

export default {
    ...defaultParserInterface,

    id: ID,
    displayName: ID,
    // version: pkg.version,
    // homepage: pkg.homepage,
    locationProps: new Set(["loc", "start", "end", "range"]),

    parse(parser, code) {
        const opts = {
            sourceType: "module"
        };

        const ast = parser.parseNoPatch(code, opts);
        delete ast.tokens;
        return ast;
    },

    nodeToRange(node) {
        if (typeof node.start !== "undefined") {
            return [node.start, node.end];
        }
    },

    _ignoredProperties: new Set(["_paths", "_babelType", "__clone"])
};
