import React, { Component } from "react";
import styled from "styled-components";
import SourceCodePanel from "../components/SourceCodePanel";
import FlexView from "react-flexview";
import {
    getAst,
    compileAstSelectorScript,
    AstSelectorResult
} from "../utils/common";
import { File } from "@babel/types";
import FlyInAlert from "../components/FlyInAlert";
import { IInstance } from "react-codemirror2";

const FlexViewStyled = styled(FlexView)`
    height: 100vh;
    padding-top: 70px;
    box-sizing: content-box;
`;

type States = {
    astCode: string;
    sourceCode: string;
    astSelectorResult: AstSelectorResult;
    astTree: File | undefined;
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
            return getAst("");
        } catch (err) {
            console.error(err);
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

    onSourceCodeChange = (sourceCode: string) => {
        const astTree = this.buildAstTree(sourceCode);
        const astSelectorResult = this.buildAstResultTree(
            this.state.astCode,
            astTree
        );
        this.setState({
            sourceCode,
            astTree: this.buildAstTree(sourceCode),
            astSelectorResult: astSelectorResult
        });
    };

    onAstCodeChange = (astCode: string) => {
        const astSelectorResult = this.buildAstResultTree(
            astCode,
            this.state.astTree
        );
        this.setState({ astCode, astSelectorResult: astSelectorResult });
    };

    onCursorActivity = (editor: IInstance) => {
        editor.getCursor().line;
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
                        <FlexView basis="50%">
                            <SourceCodePanel
                                value={this.state.astCode}
                                onBeforeChange={(editor, data, value) =>
                                    this.onAstCodeChange(value)
                                }
                            />
                        </FlexView>
                        <FlexView basis="50%" marginTop="6px">
                            <SourceCodePanel
                                value={this.state.sourceCode}
                                highlightGroups={this.state.astSelectorResult}
                                onCursorActivity={this.onCursorActivity}
                                onBeforeChange={(editor, data, value) =>
                                    this.onSourceCodeChange(value)
                                }
                            />
                        </FlexView>
                    </FlexView>
                    <FlexView height="100%" basis="30%" marginLeft="6px">
                        <SourceCodePanel
                            value={JSON.stringify(
                                Object.keys(this.state.astSelectorResult).length
                                    ? this.state.astSelectorResult
                                    : this.state.astTree.program.body,
                                undefined,
                                4
                            )}
                            onBeforeChange={() => {}}
                            foldOnMount
                            options={{
                                mode: { name: "javascript", json: true },
                                readOnly: true,
                                foldGutter: true,
                                gutters: [
                                    "CodeMirror-linenumbers",
                                    "CodeMirror-foldgutter"
                                ]
                            }}
                        />
                    </FlexView>
                </FlexViewStyled>
            </React.Fragment>
        );
    }
}
