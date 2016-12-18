var generateGraph = function() {
    var code    = document.getElementById('code').value,
        lexer   = new Lexer(),
        tokens  = lexer.tokenize(code),
        nodes   = [],
        edges   = [];

    for (var i = 0; i < tokens.length; i++) {
        nodes.push(createNode(i, tokens[i]));
    }

    for (i = 0; i < tokens.length - 1; i++) {
        edges.push(createEdge(i, i + 1));
    }

    setElementPositions(nodes, createPositionalGraph(nodes, edges));
    graphElements(nodes, edges);
};

var createNode = function(id, token) {
    return {
        data: {
            id:     id,
            type:   token.type,
            value:  token.value,
            label:  '[' + token.type + ' , ' + token.value + ']'
        }
    };
};

var createEdge = function(source, target) {
    return {
        data: {
            id:     source + '-' + target,
            source: source,
            target: target
        }
    };
};

var createPositionalGraph = function(nodes, edges) {
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

    graph.setDefaultEdgeLabel(function() { return {}; });
    edges.forEach(function(edge) {
        graph.setEdge(edge.data.source, edge.data.target);
    });

    dagre.layout(graph);
    return graph;
};

var setElementPositions = function(nodes, graph) {
    var positionedNodes = graph._nodes;
    nodes.forEach(function(node) {
        var location = positionedNodes[node.data.id];
        node.position = {
            x: location.x,
            y: location.y
        };
    });
};

var graphElements = function(nodes, edges) {
    cy.add(nodes);
    cy.add(edges);
};
