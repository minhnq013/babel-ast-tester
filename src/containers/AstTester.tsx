import React, { Component } from "react";
import styled from "styled-components";
import SourceCodePanel, {
    IHighLightGroup
} from "../components/SourceCodePanel";
import FlexView from "react-flexview";
import {
    getAst,
    compileAstSelectorScript,
    AstSelectorResult
} from "../utils/common";
import { File, Node } from "@babel/types";
import FlyInAlert from "../components/FlyInAlert";
import AstTreeVisualizer from "../components/AstTreeVisualizer";
import babelEslintParser from "../forked/astexplorer/website/src/parsers/js/babel-eslint";

const FlexViewStyled = styled(FlexView)`
    height: 100vh;
    padding-top: 70px;
    box-sizing: content-box;
`;

const StyledPlaceHolder = styled.div`
    background-color: #272822;
    color: #f8f8f2;
    padding-left: 25px;
    width: 100%;
    font-family: monospace;

    .declaration {
        color: #66d9ef;
    }
    .type {
        color: #a6e22e;
    }
`;

const defaultAstCode = `// traverse(root, {
//     VariableDeclaration: node => resolve(node)
// });`;

type States = {
    astCode: string;
    sourceCode: string;
    astSelectorResult: AstSelectorResult;
    astTree: Node | undefined;
    astCodeErrorMessage: string;
    errorMessage: string;
};

export default class AstTester extends Component<{}, States> {
    state = {
        astCode: "",
        sourceCode: "",
        astSelectorResult: {},
        astTree: undefined,
        astCodeErrorMessage: "",
        errorMessage: "",
        ...JSON.parse(localStorage.AstTester || "{}")
    };

    /**
     * Build the ast tree from the source code.
     */
    buildAstTree = (source: string) => {
        let error = { message: "" };
        try {
            return getAst(source);
        } catch (err) {
            error = err;
        } finally {
            this.setState({ errorMessage: error.message });
        }
        return this.state.astTree;
    };

    /**
     * Build the ast result from the astCode and source code.
     */
    buildAstResultTree = (
        astCode: string,
        astTree: File
    ): AstSelectorResult => {
        let error: Error = new Error("");
        try {
            const astCodeFunction = compileAstSelectorScript(astCode);
            const astSelectorResult = astCodeFunction(astTree);
            return astSelectorResult;
        } catch (err) {
            error = err;
            console.error(err);
        } finally {
            this.setState({
                astCodeErrorMessage: error ? error.message : ""
            });
        }
        return {};
    };

    /**
     * The Ast result tree computation is heavy.
     * Thus wrap in debounce for asyn experience.
     */
    updateAstResultTreeDebounce = (astCode: string, sourceCode?: string) => {
        const astTree = sourceCode
            ? this.buildAstTree(sourceCode)
            : this.state.astTree;
        const astSelectorResult = this.buildAstResultTree(astCode, astTree);

        this.setState({
            astTree,
            astSelectorResult
        });
    };

    onSourceCodeChange = (sourceCode: string) => {
        this.setState({ sourceCode });
        this.updateAstResultTreeDebounce(this.state.astCode, sourceCode);
    };

    onAstCodeChange = (astCode: string) => {
        this.setState({ astCode: astCode || defaultAstCode });
        this.updateAstResultTreeDebounce(astCode);
    };

    getHightLightGroupFromAstSelector = () => {
        const output: IHighLightGroup = {};
        const selectorResults = this.state.astSelectorResult;
        Object.keys(selectorResults).forEach((key: string) => {
            const group = selectorResults[key];
            const location = group.loc;
            if (!location) {
                return null;
            }

            output[key] = {
                startRow: location.start.line,
                startCol: location.start.column,
                endRow: location.end.line,
                endCol: location.end.column
            };
        });
        return output;
    };

    componentDidUpdate() {
        localStorage.AstTester = JSON.stringify({ ...this.state });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.errorMessage && (
                    <FlyInAlert value={this.state.errorMessage} />
                )}
                {this.state.astCodeErrorMessage && (
                    <FlyInAlert value={this.state.astCodeErrorMessage} />
                )}
                <FlexViewStyled>
                    <FlexView column grow height="100%">
                        <FlexView>
                            <StyledPlaceHolder>
                                <span className="declaration">function</span>
                                {` ( traverse: `}
                                <span className="type">@babel/traverse</span>
                                {`, resolve: `}
                                <span className="type">func(node: Node)</span>
                                {`, root: `}
                                <span className="type">@babel/types/Node</span>
                                {` ) {`}
                            </StyledPlaceHolder>
                        </FlexView>
                        <FlexView basis="35%">
                            <SourceCodePanel
                                width="100%"
                                value={this.state.astCode}
                                onChange={this.onAstCodeChange}
                            />
                        </FlexView>
                        <FlexView marginTop="6px" grow={1}>
                            <SourceCodePanel
                                width="100%"
                                value={this.state.sourceCode}
                                highlightGroups={this.getHightLightGroupFromAstSelector()}
                                onChange={this.onSourceCodeChange}
                            />
                        </FlexView>
                    </FlexView>
                    <FlexView height="100%" basis="30%" marginLeft="6px">
                        <AstTreeVisualizer
                            ast={this.state.astTree}
                            focusPath={[this.state.astSelectorResult]}
                            parser={babelEslintParser}
                        />
                    </FlexView>
                </FlexViewStyled>
            </React.Fragment>
        );
    }
}
