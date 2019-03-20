import React, { Component } from "react";
import styled from "styled-components";
import SourceCodePanel, { IHighLightGroup } from "../components/SourceCodePanel";
import FlexView from "react-flexview";
import { Node } from "@babel/types";
import FlyInAlert from "../components/FlyInAlert";
import AstTreeVisualizer from "../components/AstTreeVisualizer";
import babelEslintParser from "../forked/astexplorer/website/src/parsers/js/babel-eslint";
import { Selection } from "react-ace";
import { getAst } from "../apis/ast";

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

export type AstSelectorResult = Node[];

type States = {
    astCode: string;
    sourceCode: string;
    astSelectorResult: AstSelectorResult;
    astTree?: Node;
    astCodeErrorMessage: string;
    errorMessage: string;
    currentHoveredNodes: Node[];
};

const localStorageAstTester = JSON.parse(localStorage.AstTester);

export default class AstTester extends Component<{}, States> {
    state = {
        astCode: localStorageAstTester.astCode || "",
        sourceCode: localStorageAstTester.sourceCode || "",
        astSelectorResult: [],
        astTree: undefined,
        astCodeErrorMessage: "",
        errorMessage: "",
        currentHoveredNodes: []
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
            console.error(err);
        } finally {
            this.setState({ errorMessage: error.message });
        }
        return this.state.astTree;
    };

    /**
     * Build the ast result from the astCode and source code.
     */
    buildAstResultTree = (astCode: string, sourceCode: string): AstSelectorResult => {
        let error: Error = new Error("");
        try {
            const astCodeFunction = compileAstSelectorScript(astCode, babelEslintParserAdapter);
            const astSelectorResult = astCodeFunction(sourceCode);
            return astSelectorResult;
        } catch (err) {
            error = err;
            console.error(err);
        } finally {
            this.setState({
                astCodeErrorMessage: error ? error.message : ""
            });
        }
        return [];
    };

    onSourceCodeChange = (sourceCode: string) => {
        const astTree = this.buildAstTree(sourceCode);
        const astSelectorResult = this.buildAstResultTree(this.state.astCode, this.state.sourceCode);
        this.setState({ sourceCode, astSelectorResult, astTree });
    };

    onAstCodeChange = (astCode: string) => {
        const astSelectorResult = this.buildAstResultTree(astCode, this.state.sourceCode);

        this.setState({
            astCode: astCode || defaultAstCode,
            astSelectorResult
        });
    };

    getHightLightGroupFromAstSelector = () => {
        let output: IHighLightGroup[] = [];
        const astSelectorResult: AstSelectorResult = this.state.astSelectorResult;

        astSelectorResult.forEach(nodePath => {
            const location = nodePath ? nodePath.loc : null;
            if (!location) {
                return null;
            }

            output.push({
                startRow: location.start.line,
                startCol: location.start.column,
                endRow: location.end.line,
                endCol: location.end.column
            });
        });

        const currentHoveredNodes: Node[] = this.state.currentHoveredNodes;
        if (currentHoveredNodes) {
            const markers = currentHoveredNodes
                .filter(node => !!node.loc)
                .map(node => {
                    return {
                        startRow: node.loc!.start.line,
                        startCol: node.loc!.start.column,
                        endRow: node.loc!.end.line,
                        endCol: node.loc!.end.column
                    };
                });
            output = output.concat(markers);
        }
        return output;
    };

    onSourceCusorChange = (selection: Selection) => {};

    componentDidUpdate() {
        localStorage.AstTester = JSON.stringify({
            sourceCode: this.state.sourceCode,
            astCode: this.state.astCode
        });
    }

    componentDidMount() {
        this.setState({
            astTree: this.buildAstTree(this.state.sourceCode),
            astSelectorResult: this.buildAstResultTree(this.state.astCode, this.state.sourceCode)
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.errorMessage && <FlyInAlert value={this.state.errorMessage} />}
                {this.state.astCodeErrorMessage && <FlyInAlert value={this.state.astCodeErrorMessage} />}
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
                            <SourceCodePanel width="100%" value={this.state.astCode} onChange={this.onAstCodeChange} />
                        </FlexView>
                        <FlexView marginTop="6px" grow={1}>
                            <SourceCodePanel
                                width="100%"
                                value={this.state.sourceCode}
                                highlightGroups={this.getHightLightGroupFromAstSelector()}
                                onChange={this.onSourceCodeChange}
                                onCursorChange={this.onSourceCusorChange}
                            />
                        </FlexView>
                    </FlexView>
                    <FlexView height="100%" basis="30%" marginLeft="6px">
                        <AstTreeVisualizer
                            ast={this.state.astTree!}
                            focusPath={this.state.astSelectorResult}
                            parser={babelEslintParser}
                            onNodeMouseEnter={(e, { value }) =>
                                this.setState({
                                    currentHoveredNodes: value
                                })
                            }
                            onNodeMouseLeave={() => {
                                this.setState({
                                    currentHoveredNodes: []
                                });
                            }}
                        />
                    </FlexView>
                </FlexViewStyled>
            </React.Fragment>
        );
    }
}
