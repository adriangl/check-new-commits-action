module.exports = {
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:jest/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.eslint.json",
        sourceType: "module",
    },
    plugins: [
        "jest",
        "@typescript-eslint",
        "eslint-plugin-deprecation",
        "eslint-plugin-import",
    ],
    rules: {
        "no-sequences": "error",
        "no-param-reassign": "error",
        "no-unused-labels": "error",
        "no-cond-assign": "error",
        "no-new-wrappers": "error",
        "constructor-super": "error",
        "no-duplicate-case": "error",
        "no-redeclare": "error",
        "no-shadow": [
            "error",
            {
                hoist: "all",
            },
        ],
        "no-empty": [
            "error",
            {
                allowEmptyCatch: true,
            },
        ],
        "no-invalid-this": "error",
        "no-unsafe-finally": "error",
        "no-var": "warn",
        "no-console": "off",
        "eqeqeq": ["warn", "always"],
        "prefer-const": "error",
        "deprecation/deprecation": "warn",
        "import/no-extraneous-dependencies": "error",
        "import/no-duplicates": "warn",
        "import/no-unassigned-import": "warn",
        "import/no-internal-modules": "off",
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/triple-slash-reference": [
            "error",
            {
                path: "always",
                types: "prefer-import",
                lib: "always",
            },
        ],
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-confusing-void-expression": "error",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/unified-signatures": "warn",
        "@typescript-eslint/no-unsafe-assignment": "error"
    },
    env: {
        "node": true,
    },
}