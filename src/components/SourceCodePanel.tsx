import {
    Controlled as CodeMirrorComponent,
    IControlledCodeMirror,
    IInstance
} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import React from "react";
import styled from "styled-components";

const StyledCodeMirror = styled(CodeMirrorComponent)`
    width: 100%;
    height: 100%;

    .CodeMirror {
        height: 100%;
        padding-left: 10px;
    }
`;

interface Props extends IControlledCodeMirror {
    foldOnMount?: boolean;
    highlightGroups?: {
        [key: string]: { start: number; end: number };
    };
}

const foldAllExceptFirst = (editor: IInstance) => {
    editor.execCommand("foldAll");

    // Unfold first line
    // @ts-ignore
    editor.foldCode(0, null, "unfold");
};

const SourceCodePanel = ({
    highlightGroups = {},
    foldOnMount = false,
    options,
    ...restProps
}: Props) => (
    <StyledCodeMirror
        {...restProps}
        editorDidMount={foldOnMount ? foldAllExceptFirst : () => {}}
        onChange={editor => (foldOnMount ? foldAllExceptFirst(editor) : null)}
        options={{
            mode: "javascript",
            theme: "material",
            lineNumbers: true,
            ...options
        }}
    />
);

export default SourceCodePanel;
