const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const generateColorMap = require("./colors.js"); 

function activate() {
    const config = () => vscode.workspace.getConfiguration(); 
    const themePath = path.join(__dirname, "themes", "dynamic-color-theme.json");

    const generateTheme = () => {
        const colors = generateColorMap(); 
        const theme = {
            "$schema": "vscode://schemas/color-theme",
            "type": "dark",
            "colors": colors,
            "tokenColors": [
                {
                    "scope": "keyword",
                    "settings": {
                        "foreground": config().get("dynamicTheme.keywordColor") 
                    }
                }
            ]
        };
        const themeDir = path.dirname(themePath);
        if (!fs.existsSync(themeDir)) {
            fs.mkdirSync(themeDir);
        }
        fs.writeFileSync(themePath, JSON.stringify(theme, null, 2));
    };

    generateTheme();
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration("dynamicTheme")) {
            generateTheme();
            vscode.workspace
                .getConfiguration()
                .update("workbench.colorTheme", "Dynamic Theme", true);
        }
    });
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}