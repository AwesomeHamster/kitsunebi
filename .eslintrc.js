module.exports = {
  root: true,
  env: {
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json',
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/brace-style": ["error"],
    "@typescript-eslint/comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "always-multiline",
      "enums": "always-multiline",
      "generics": "always-multiline",
      "tuples": "always-multiline",
    }],
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/return-await": ["error", "always"],
    "@typescript-eslint/semi": ["error"],
    "brace-style": "off",
    "comma-dangle": "off",
    "indent": "off",
    "max-len": ["error", { "code": 120 }],
    "no-return-await": "off",
    "no-trailing-spaces": "error",
    "quotes": "off",
    "semi": "off",
  },
};
