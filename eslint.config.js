// ESLint flat config (ESLint 9+). Migrated from .eslintrc.json + .eslintignore.
// Lint scope is scripts/ (node tooling we own); the merged userscript is
// excluded because it vendors legacy upstream code with known lint issues.
"use strict";

const userscriptGlobals = {
    GM_setValue: "readonly",
    GM_getValue: "readonly",
    GM_deleteValue: "readonly",
    GM_listValues: "readonly",
    GM_xmlhttpRequest: "readonly",
    GM_download: "readonly",
    GM_registerMenuCommand: "readonly",
    GM_config: "readonly",
    GM_fetch: "readonly",
    unsafeWindow: "readonly",
    InfiniteScroll: "readonly",
    Mousetrap: "readonly",
    OCRAD: "readonly",
    Tesseract: "readonly",
    $: "readonly",
    jQuery: "readonly",
};

const nodeGlobals = {
    require: "readonly",
    module: "writable",
    exports: "writable",
    process: "readonly",
    console: "readonly",
    __dirname: "readonly",
    __filename: "readonly",
    Buffer: "readonly",
};

module.exports = [
    {
        ignores: ["node_modules/", "dist/", "build/", "rarbg-enhancer.user.js"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "script",
            globals: { ...nodeGlobals, ...userscriptGlobals },
        },
        rules: {
            "no-unused-vars": "warn",
            "prefer-const": "error",
            "no-var": "off",
            "no-undef": "error",
            eqeqeq: ["warn", "smart"],
        },
    },
];
