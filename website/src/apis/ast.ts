import envConfigs from "../../configs/config.json";

export const getAst = async (sourceCode: string) => {
    const response = await fetch(`${envConfigs.astService.url}/buildAst`, {
        body: sourceCode
    });
};

export const compileAstSelectorScript = async (astCode: string) => {
    const response = await fetch(`${envConfigs.astService.url}/buildAst`, {
        body: astCode
    });
};
