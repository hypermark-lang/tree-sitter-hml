/**
 * @file HML is a small markup language that looks a bit like HTML, but uses block syntax with curly braces.
 * @author Eduardo Flores <edfloreshz@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "hml",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat($._node),

    _node: ($) => choice($.element, $.text),

    element: ($) =>
      prec.right(
        seq(
          field("name", $.tag_name),
          optional(field("attributes", $.attribute_list)),
          optional(
            choice(field("content", $.inline_text), field("body", $.block)),
          ),
        ),
      ),

    block: ($) => seq("{", repeat($._statement), "}"),

    _statement: ($) =>
      choice(
        $.style_declaration,
        $.element,
        $.text,
      ),

    attribute_list: ($) =>
      seq(
        "[",
        optional(
          seq($.attribute, repeat(seq(",", $.attribute)), optional(",")),
        ),
        "]",
      ),

    attribute: ($) =>
      seq(field("name", $.identifier), ":", field("value", $.value)),

    style_declaration: ($) =>
      seq(
        field("property", alias($.css_property, $.identifier)),
        ":",
        field("value", $.value),
      ),

    text: ($) => $.string,

    inline_text: ($) => $.string,

    value: ($) =>
      choice(
        $.string,
        $.color,
        $.number,
        $.identifier,
        $.keyword_value,
      ),

    string: ($) => token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),

    number: ($) =>
      token(
        /-?(?:\d+\.\d+|\d+)(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)?(?:\s+-?(?:\d+\.\d+|\d+)(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)?){0,3}/,
      ),

    color: ($) => token(/#[0-9a-fA-F]{3,8}/),

    tag_name: ($) => /[A-Z][A-Za-z0-9_-]*/,

    identifier: ($) => /[A-Za-z_][A-Za-z0-9_-]*/,

    css_property: ($) => /[a-z][a-z0-9-]*/,

    keyword_value: ($) =>
      choice(
        "auto",
        "none",
        "solid",
        "collapse",
        "flex",
        "grid",
        "block",
        "inline-block",
        "inline",
        "white",
        "black",
        "center",
        "left",
        "right",
        "start",
        "end",
        "space-between",
        "uppercase",
        "pointer",
      ),

    comment: ($) =>
      token(
        choice(
          seq("//", /.*/),
          seq(
            "/*",
            /[^*]*\*+([^/*][^*]*\*+)*/,
            "/",
          ),
        ),
      ),
  },
});
