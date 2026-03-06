package tree_sitter_hml_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_hml "github.com/hypermark-lang/tree-sitter-hml/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_hml.Language())
	if language == nil {
		t.Errorf("Error loading HML grammar")
	}
}
