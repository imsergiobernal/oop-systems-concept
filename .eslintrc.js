module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        "project": "./tsconfig.json"
    },
    plugins: [
        '@typescript-eslint',
    ],
    ignorePatterns: ["dist/", "node_modules/"],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: { }
};
