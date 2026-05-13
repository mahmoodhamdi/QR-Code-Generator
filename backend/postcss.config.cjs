// Empty postcss config — backend doesn't have CSS. This file exists so vitest
// stops searching for a postcss config in parent directories (the root config
// imports @tailwindcss/postcss which isn't installed here).
module.exports = {};
