import React from "react";
import Tree from "../../forked/astexplorer/website/src/components/visualization/Tree";
import "../../forked/astexplorer/website/css/style.css";

export default function AstTreeVisualizer({
    focusPath = [],
    ast = {},
    parser = {}
}: any) {
    return (
        <div className="highlight">
            <Tree ast={ast} focusPath={focusPath} parser={parser} />
        </div>
    );
}
