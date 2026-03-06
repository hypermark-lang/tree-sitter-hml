# tree-sitter-hml

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for **HML**, a small markup language that looks a bit like HTML but uses block syntax with curly braces.

## Overview

This grammar parses HML documents with:

- uppercase element names like `Document`, `Body`, `Box`, and `Paragraph`
- optional attribute lists in square brackets
- inline string content
- nested block content
- inline style declarations using CSS-like property syntax
- comments using `// ...` and `/* ... */`

Example HML:

```hml
Document {
  Body {
    Box[class: "page"] {
      background-color: #f8fafc
      padding: 32px

      Paragraph {
        color: #475569
        font-size: 16px

        "Hello from HML"
      }
    }
  }
}
```

## Grammar shape

The parser currently recognizes core node types such as:

- `source_file`
- `element`
- `attribute_list`
- `attribute`
- `block`
- `style_declaration`
- `text`
- `inline_text`
- `value`
- `tag_name`
- `identifier`
- `string`
- `number`
- `color`
- `keyword_value`
- `comment`

### Important distinction

Element names and style properties are intentionally separated:

- element names use `tag_name`
- style properties use `identifier`

That allows input like this to parse correctly:

```hml
Box {
  background-color: #ffffff
}
```

without incorrectly treating `background-color` as another element.

## Supported value forms

The grammar supports values such as:

- strings: `"Hello"`
- colors: `#4f46e5`
- numbers: `12`, `1.5`, `100%`
- dimensions: `16px`, `0.08em`, `100vh`
- multi-part numeric values: `0 40px 40px 40px`
- identifiers: `serif`
- keyword values: `flex`, `grid`, `auto`, `center`, `pointer`

## Project structure

Typical important files in this repository:

- `grammar.js` — source grammar definition
- `src/parser.c` — generated parser
- `src/grammar.json` — generated grammar JSON
- `src/node-types.json` — generated node type definitions
- `examples/` — example `.hml` files used for validation
- `bindings/` — generated and maintained language bindings
- `tree-sitter.json` — Tree-sitter package metadata

## Development

### Install dependencies

```sh
npm install
```

### Regenerate the parser

Whenever you update `grammar.js`, regenerate the generated artifacts:

```sh
npx tree-sitter generate
```

This updates files such as:

- `src/parser.c`
- `src/grammar.json`
- `src/node-types.json`

### Test parsing against examples

You can validate the grammar against the example documents:

```sh
for f in examples/*.hml; do
  echo "=== $f ==="
  npx tree-sitter parse "$f"
done
```

A healthy grammar should parse these files without `ERROR` nodes.

### Build the WebAssembly parser

If you want a WASM artifact for editor integration or testing:

```sh
npx tree-sitter build --wasm
```

This should produce a `.wasm` build artifact in the repository.

### Run Rust tests

This repository also includes Rust bindings:

```sh
cargo test
```

## Query authoring notes

If you are writing editor queries for this grammar, make sure they match the actual node names.

For example:

- use `tag_name` for element names
- use `identifier` for attribute names
- use `style_declaration` for CSS-like property/value lines
- do not query nonexistent nodes such as `property`, `line_comment`, or `block_comment`

A correct pattern for element highlighting looks like:

```scm
(element
  name: (tag_name) @tag)
```

A correct pattern for style declarations looks like:

```scm
(style_declaration
  property: (identifier) @property)
```

## Zed extension workflow

If you are using this grammar from a local Zed extension during development:

1. point the extension grammar entry at the local repository using a `file://` URL
2. use `HEAD` for the development revision
3. install the extension from the extension root, not from the grammar repository root
4. ensure your query files match the current node types from `src/node-types.json`

## Notes on comments

The grammar supports:

- `// line comments`
- `/* block comments */`

If you configure editor comment behavior, use `// ` as the line comment prefix.
