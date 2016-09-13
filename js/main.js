var scopes = [];
var loops = [];

function generateGraph() {
    parseCode({x: STARTING_X, y: STARTING_Y},  null);
}

function parseCode(currentPosition, language) {
    var code = document.getElementById('code').value;
    if (language === null) {
        language = DEFAULT_LANGUAGE;
    }
    var edges = [];
    var lines = code.split('\n');

    for (var i = 0; i < lines.length; i++) {
        var lineOfCode = lines[i].trim();
        if (!shouldParse(lineOfCode)) {
            continue;
        }
        var element = createElements(i, lineOfCode, language, currentPosition);
        if (element.type === ELEMENT_TYPES.NODE) {
            if (i < lines.length - 1 && needsEdge(lines[i + 1].trim(), language)) {
                edges.push(createEdge(i, i + 1));
            }
            cy.add(element.core);
        } else if (element.type === ELEMENT_TYPES.EDGE) {
            edges.push(element.core);
        }
    }
    cy.add(edges);
}

function shouldParse(line) {
    return line !== '}' && line !== '{' && line !== ''
}

function createElements(id, line, language, currentPosition) {
    if (LANGUAGE_PATTERNS[language].IF_CHECK.test(line)) {
        currentPosition.y -= NODE_HEIGHT + NODE_VERTICAL_SPACING;
        return {
            type: ELEMENT_TYPES.EDGE,
            core: {
                data: {
                    id: (id - 1) + '-' + (id + 1),
                    source: (id - 1),
                    target: (id + 1),
                    condition: parseCondition(line, CONDITION_TYPES.IF, language)
                }
            }
        };
    } else if (LANGUAGE_PATTERNS[language].WHILE_CHECK.test(line)) {

    } else if (LANGUAGE_PATTERNS[language].FOR_CHECK.test(line)) {

    } else {    // case: line of code, create node
        currentPosition.x += NODE_WIDTH + NODE_HORIZONTAL_SPACING;
        if (line.endsWith(LANGUAGE_PATTERNS[language].LINE_END)) {   // strip trailing apostrophe
            line = line.slice(0, -1);
        }
        return {
            type: ELEMENT_TYPES.NODE,
            core: {
                data: {
                    id: id,
                    code: line
                },
                position: {
                    x: currentPosition.x,
                    y: currentPosition.y
                }
            }
        };
    }
}

function needsEdge(line, language) {
    return !(LANGUAGE_PATTERNS[language].IF_CHECK.test(line) || LANGUAGE_PATTERNS[language].ELSE_IF_CHECK.test(line) ||
    LANGUAGE_PATTERNS[language].ELSE_CHECK.test(line) || LANGUAGE_PATTERNS[language].WHILE_CHECK.test(line) ||
    LANGUAGE_PATTERNS[language].FOR_CHECK.test(line) || !shouldParse(line));
}

function createEdge(source, target) {
    return {
        data: {
            id: source + '-' + target,
            source: source,
            target: target,
            condition: ''
        }
    };
}

function parseCondition(line, type, language) {
    switch (type) {
        case CONDITION_TYPES.IF:
            return parseIf(line, language);
        default:
            return 'UNSUPPORTED CONDITION SYNTAX'
    }
}

function parseIf(line, language) {
    var startConditionIndex = line.indexOf(LANGUAGE_PATTERNS[language].CONDITION_START);
    var endConditionIndex = line.lastIndexOf(LANGUAGE_PATTERNS[language].CONDITION_END);
    return line.slice(startConditionIndex + 1, endConditionIndex);
}
