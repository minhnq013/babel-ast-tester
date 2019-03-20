import { parseNoPatch } from "babel-eslint";
import { linter } from "eslint";
import { Node } from "@babel/types";

export type IRules = {
    [key: string]: (node: Node) => any;
};

export type IParserAdapter = {
    parse(code: String, options: any): Node;
    traverse(code: string, rules: IRules, configs: { parserOptions: {} }): any;
};

const adapter: IParserAdapter = {
    parse(code: String, options: any): Node {
        return parseNoPatch(code, options);
    },

    traverse(code: string, rules: IRules, configs?: { parserOptions: {} }) {
        if (!rules) {
            return;
        }

        const parserOptions = configs ? configs.parserOptions : {};
        const actualConfig = {
            rules: {} as { [key: string]: number },
            parserOptions: {
                ecmaVersion: 6,
                ...parserOptions
            }
        };

        Object.entries(rules).forEach(([ruleId, ruleConfig]) => {
            linter.defineRule(ruleId, ruleConfig);
            actualConfig.rules[ruleId] = 2;
        });
        linter.verify(code, actualConfig);
    }
};

export default adapter;
