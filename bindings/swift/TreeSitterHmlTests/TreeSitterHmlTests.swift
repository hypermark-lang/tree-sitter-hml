import XCTest
import SwiftTreeSitter
import TreeSitterHml

final class TreeSitterHmlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_hml())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading HML grammar")
    }
}
