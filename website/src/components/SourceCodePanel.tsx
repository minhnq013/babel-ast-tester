import brace, { Editor } from "brace";
import AceEditor, { AceEditorProps, Marker } from "react-ace";

import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/ext/language_tools";
import styled from "styled-components";
import React, { Component } from "react";

const StyledAceEditor = styled(AceEditor)`
    width: 100%;
    height: 100%;

    .marked-highlight {
        background-color: rgba(50, 255, 255, 0.2);
        position: absolute; /* Hack to fix ace editor marker issue */
    }
`;

export type IHighLightGroup = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    className?: string;
};

interface Props extends AceEditorProps {
    highlightGroups?: IHighLightGroup[];
}

export default class SourceCodePanel extends Component<Props> {
    aceEditor: Editor | null = null;

    getMarkers = (): Marker[] => {
        const { highlightGroups } = this.props;
        if (!highlightGroups) {
            return [];
        }

        return highlightGroups.map(group => ({
            startRow: group.startRow - 1,
            startCol: group.startCol,
            endRow: group.endRow - 1,
            endCol: group.endCol,
            className: group.className || "marked-highlight",
            type: "text",
            inFront: true
        }));
    };

    onLoad = (editor: any) => {
        this.aceEditor = editor;
    };

    render() {
        const { highlightGroups = {}, ...restProps } = this.props;

        return (
            <StyledAceEditor
                onLoad={this.onLoad}
                mode="javascript"
                theme="monokai"
                markers={this.getMarkers()}
                setOptions={{
                    enableLiveAutocompletion: true
                }}
                style={{
                    height: "100%"
                }}
                {...restProps}
            />
        );
    }
}
