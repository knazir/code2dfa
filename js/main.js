var scopes = [];
var loops = [];
var edges = [];
var nodes = [];

function generateGraph() {
    parseCode(null);
}

function parseCode(language) {
    var code = document.getElementById('code').value;
    var lines = code.split('\n');
    if (language === null) {
        language = DEFAULT_LANGUAGE;
    }

    for (var i = 0; i < lines.length; i++) {
        var lineOfCode = lines[i].trim();
        if (!shouldParse(lineOfCode, language)) {
            continue;
        }
        var element = createElements(i, lineOfCode, language);
        if (element.type === ELEMENT_TYPES.NODE) {
            if (i < lines.length - 1 && needsEdge(lines[i + 1].trim(), language)) {
                edges.push(createEdge(i, i + 1));
            }
            nodes.push(element.core);
        } else if (element.type === ELEMENT_TYPES.EDGE) {
            edges.push(element.core);
        }
    }

    setElementPositions(createPositionalGraph());
    graphElements();
}

// TODO: Make this language-dependent
function shouldParse(line, language) {
    return line !== '}' && line !== '{' && line !== ';' && line !== ''
}

function createElements(id, line, language) {
    if (LANGUAGE_PATTERNS[language].IF_CHECK.test(line)) {
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

function createPositionalGraph() {
    var graph = new dagre.graphlib.Graph();
    graph.setGraph({
        nodesep: NODE_SEPARATION,
        ranksep: RANK_SEPARATION,
        rankdir: RANK_DIRECTION,
        marginx: MARGIN_X,
        marginy: MARGIN_Y
    });

    nodes.forEach(function(node) {
        var id = node.data.id;
        graph.setNode(id, { label: id, width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach(function(edge) {
        graph.setDefaultEdgeLabel(function() { return {}; });
        graph.setEdge(edge.data.source, edge.data.target);
    });

    dagre.layout(graph);
    return graph;
}

function setElementPositions(graph) {
    var positionedNodes = graph._nodes;
    nodes.forEach(function(node) {
        var location = positionedNodes[node.data.id];
        node.position = {
            x: location.x,
            y: location.y
        };
    });
}

function graphElements() {
    cy.add(nodes);
    cy.add(edges);
}
