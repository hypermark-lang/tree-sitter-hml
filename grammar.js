/**
 * @file HML is a small markup language that looks a bit like HTML, but uses block syntax with curly braces.
 * @author Eduardo Flores <edfloreshz@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "hml",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => "hello",
  },
});
