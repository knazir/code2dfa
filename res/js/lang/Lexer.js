/*
 * Lexer class to tokenize a custom language similar in syntax to JavaScript and C.
 */
function Lexer() {
    this.KEYWORDS = ['def', 'class', 'if', 'true', 'false', 'nil', 'while'];

    this.chomp = function(rawText) {
        return rawText.replace(/(\n|\r)+$/, '');
    };
}

/*
 * Wrapper class to store token data.
 */
function Token(type, value) {
    this.type = type;
    this.value = value;
}

Token.prototype.toString = function() {
    return '{Type: ' + this.type + ', ' + 'Value: ' + this.value + '}';
};

Lexer.prototype.constructor = Lexer;

Lexer.prototype.tokenize = function(code) {
    code = this.chomp(code);

    var tokens          = [],
        indentStack     = [],
        currentIndent   = 0;    // TODO: Add support for delimiting code blocks by indentation

    for (var i = 0; i < code.length;) {
        var chunk = code.substr(i);

        // check for identifier
        if (matches = chunk.match(/^([a-z]+\b)/)) {
            var identifier = matches[0];
            if (this.KEYWORDS.indexOf(identifier) > -1) {
                tokens.push(new Token(':' + identifier.toUpperCase(), identifier));
            } else {
                tokens.push(new Token(':IDENTIFIER', identifier));
            }

            i += identifier.length;
        }

        // check for constants
        else if (matches = chunk.match(/^([A-Z]+[a-z]*\b)/)) {
            var constant = matches[0];
            tokens.push(new Token(':CONSTANT', constant));
            i += constant.length;
        }

        // check for number
        else if (matches = chunk.match(/^([0-9]+\b)/)) {
            var number = matches[0];
            tokens.push(new Token(':NUMBER', parseInt(number)));
            i += number.length;
        }

        // check for string
        else if (matches = chunk.match(/^"([^"]*)"/)) {
            var string = matches[0].substr(1, matches[0].length - 2);
            tokens.push(new Token(':STRING', string));
            i += string.length + 2;
        }

        // check for newlines if indentation is not significant
        else if (matches = chunk.match(/^\n/)) {
            tokens.push(new Token(':NEWLINE', '\n'));
            i++;
        }

        // check for operators
        else if (matches = chunk.match(/^(\|\||&&|==|!=|<=|>=)/)) {
            var operator = matches[0];
            tokens.push(new Token(operator, operator));
            i += operator.length;
        }

        // check for and ignore spaces
        else if (matches = chunk.match(/^ /)) {
            i++;
        }

        else {
            // check all single characters, mainly operators
            value = chunk.substr(0, 1);
            tokens.push(new Token(value, value));
            i++;
        }
    }

    while (indentStack.length > 0) {
        tokens.push(new Token(':DEDENT', indentStack.pop() || 0));
    }

    return tokens;
};
