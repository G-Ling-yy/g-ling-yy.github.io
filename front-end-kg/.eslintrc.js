module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    semi: 0,
    "prettier/prettier": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
