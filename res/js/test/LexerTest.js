/*
 * Tests for Lexer class.
 */
var printDifference = function(message, expected, tokens) {
    console.log(message);
    console.log('Expected:');
    console.log(expected);
    console.log('Actual:');
    console.log(tokens);
};

var tokensEqual = function(expected, tokens) {
    if (expected.length !== tokens.length) {
        printDifference('Number of expected tokens (' + expected.length + ') !== ' +
                        'Number of actual tokens (' + tokens.length + ').', expected, tokens);
        return false;
    }

    for (var i = 0; i < tokens.length; i++) {
        if (expected[i].type !== tokens[i].type) {
            printDifference('Token types differ.', expected[i], tokens[i]);
            return false;
        } else if (expected[i].value !== tokens[i].value) {
            printDifference('Token values differ.', expected[i], tokens[i]);
            return false;
        }
    }
    return true;
};

var lexer = new Lexer();

var testNumbers = function() {
    unitjs.assert(tokensEqual([new Token(':NUMBER', 1)], lexer.tokenize('1')));
};

var testStrings = function() {
    unitjs.assert(tokensEqual([new Token(':STRING', 'hi')], lexer.tokenize('"hi"')));
};

var testIdentifiers = function() {
    unitjs.assert(tokensEqual([new Token(':IDENTIFIER', 'name')], lexer.tokenize('name')));
};

var testConstants = function() {
    unitjs.assert(tokensEqual([new Token(':CONSTANT', 'Name')], lexer.tokenize('Name')));
};

var testOperators = function() {
    unitjs.assert(tokensEqual([new Token('+', '+')], lexer.tokenize('+')));
    unitjs.assert(tokensEqual([new Token('||', '||')], lexer.tokenize('||')));
};

var testNonIndentedCode = function() {
    var code = '\
if 1 {\n\
  if 2 {\n\
    print("...")\n\
    if false {\n\
      pass\n\
    }\n\
    print("done!")\n\
  }\n\
}\n\
print "The End"\n\
';

    tokens = [
        new Token(':IF', 'if'), new Token(':NUMBER', 1), new Token('{', '{'), new Token(':NEWLINE', '\n'),
            new Token(':IF', 'if'), new Token(':NUMBER', 2), new Token('{', '{'), new Token(':NEWLINE', '\n'),
                new Token(':IDENTIFIER', 'print'), new Token('(', '('),
                new Token(':STRING', '...'), new Token(')', ')'), new Token(':NEWLINE', '\n'),
                new Token(':IF', 'if'), new Token(':FALSE', 'false'), new Token('{', '{'), new Token(':NEWLINE', '\n'),
                    new Token(':IDENTIFIER', 'pass'), new Token(':NEWLINE', '\n'),
                new Token('}', '}'), new Token(':NEWLINE', '\n'),
                new Token(':IDENTIFIER', 'print'),
                new Token('(', '('), new Token(':STRING', 'done!'), new Token(')', ')'), new Token(':NEWLINE', '\n'),
            new Token('}', '}'), new Token(':NEWLINE', '\n'),
        new Token('}', '}'), new Token(':NEWLINE', '\n'),
        new Token(':IDENTIFIER', 'print'), new Token(':STRING', 'The End')
    ];

    unitjs.assert(tokensEqual(tokens, lexer.tokenize(code)));
};

var runTests = function() {
    testNumbers();
    testStrings();
    testIdentifiers();
    testConstants();
    testOperators();
    testNonIndentedCode();
};

runTests();
