module.exports = {
  root: true,
  env: {
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  parser: "@typescript-eslint/parser",
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
    "@typescript-eslint/semi": ["error"],
    "brace-style": "off",
    "comma-dangle": "off",
    "indent": "off",
    "max-len": ["error", { "code": 120 }],
    "no-trailing-spaces": "error",
    "quotes": "off",
    "semi": "off",
  },
};
