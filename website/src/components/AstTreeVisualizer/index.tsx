import React from "react";
import Tree from "../../forked/astexplorer/website/src/components/visualization/Tree";
import "../../forked/astexplorer/website/css/style.css";
import { Node } from "@babel/types";
import styled from "styled-components";

const StyledWrapper = styled.div`
    overflow: auto;
`;

type IElementEvent = {
    open: boolean;
    deepOpen: boolean;
    value: Node[];
};

export default function AstTreeVisualizer({
    focusPath = [],
    ast,
    parser = {},
    onNodeMouseEnter = () => {},
    onNodeMouseLeave = () => {}
}: {
    focusPath: Node[];
    ast: Node;
    parser: object;
    onNodeMouseEnter?(event: React.MouseEvent, element: IElementEvent): any;
    onNodeMouseLeave?(event: React.MouseEvent, element?: IElementEvent): any;
}) {
    return (
        <StyledWrapper className="highlight">
            <Tree
                ast={ast}
                focusPath={focusPath}
                parser={parser}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
            />
        </StyledWrapper>
    );
}
