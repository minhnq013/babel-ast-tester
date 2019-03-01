declare module "eslint" {
    export class CLIEngine {
        static getErrorResults(results: any): any;
        static getFormatter(format: any): any;
        static outputFixes(report: any): void;
        static version: string;
        constructor(providedOptions: any);
        options: any;
        linter: any;
        config: any;
        addPlugin(name: any, pluginobject: any): void;
        executeOnFiles(patterns: any): any;
        executeOnText(text: any, filename: any, warnIgnored: any): any;
        getConfigForFile(filePath: any): any;
        getFormatter(format: any): any;
        getRules(): any;
        isPathIgnored(filePath: any): any;
        resolveFileGlobPatterns(patterns: any): any;
    }
    export class Linter {
        static version: any;
        version: any;
        rules: any;
        environments: any;
        defineParser(parserId: any, parserModule: any): void;
        defineRule(ruleId: any, ruleModule: any): void;
        defineRules(rulesToDefine: any): void;
        getRules(): any;
        getSourceCode(): any;
        verify(textOrSourceCode: any, config: any, filenameOrOptions: any): any;
        verifyAndFix(text: any, config: any, options: any): any;
    }
    export class RuleTester {
        static describe: any;
        static getDefaultConfig(): any;
        static it: any;
        static resetDefaultConfig(): void;
        static setDefaultConfig(config: any): void;
        constructor(testerConfig: any);
        testerConfig: any;
        rules: any;
        linter: any;
        defineRule(name: any, rule: any): void;
        run(ruleName: any, rule: any, test: any): void;
    }
    export class SourceCode {
        static splitLines(text: any): any;
        constructor(textOrConfig: any, astIfNoConfig: any);
        hasBOM: any;
        text: any;
        ast: any;
        parserServices: any;
        scopeManager: any;
        visitorKeys: any;
        tokensAndComments: any;
        lines: any;
        lineStartIndices: any;
        commentsExistBetween(left: any, right: any): any;
        getAllComments(): any;
        getComments(node: any): any;
        getCommentsAfter(nodeOrToken: any): any;
        getCommentsBefore(nodeOrToken: any): any;
        getCommentsInside(node: any): any;
        getFirstToken(node: any, options: any): any;
        getFirstTokenBetween(left: any, right: any, options: any): any;
        getFirstTokens(node: any, options: any): any;
        getFirstTokensBetween(left: any, right: any, options: any): any;
        getIndexFromLoc(loc: any): any;
        getJSDocComment(node: any): any;
        getLastToken(node: any, options: any): any;
        getLastTokenBetween(left: any, right: any, options: any): any;
        getLastTokens(node: any, options: any): any;
        getLastTokensBetween(left: any, right: any, options: any): any;
        getLines(): any;
        getLocFromIndex(index: any): any;
        getNodeByRangeIndex(index: any): any;
        getText(node: any, beforeCount: any, afterCount: any): any;
        getTokenAfter(node: any, options: any): any;
        getTokenBefore(node: any, options: any): any;
        getTokenByRangeStart(offset: any, options: any): any;
        getTokenOrCommentAfter(node: any, skip: any): any;
        getTokenOrCommentBefore(node: any, skip: any): any;
        getTokens(node: any, beforeCount: any, afterCount: any): any;
        getTokensAfter(node: any, options: any): any;
        getTokensBefore(node: any, options: any): any;
        getTokensBetween(left: any, right: any, padding: any): any;
        isSpaceBetweenTokens(first: any, second: any): any;
    }
    export const linter: any;
}
