/* * * * * * * * * * * * * *
 * Constants and Cytoscape *
 * * * * * * * * * * * * * */

// Node Settings
const NODE_HEIGHT = 100;
const NODE_WIDTH = 100;

// Cytoscape Main Object
var cy = cytoscape({
    container: $('#cy'), // container to render in

    style: [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'height': NODE_HEIGHT,
                'width': NODE_WIDTH,
                'background-color': '#fff',
                'border-width': 1,
                'border-color': '#000',
                'label': 'data(code)',
                'text-valign': 'center'
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'label': 'data(condition)',
                'text-valign': 'top',
                'curve-style': 'bezier'
            }
        }
    ],

    layout: {
        name: 'random',
        rows: 1
    }
});

// Cytoscape Element Types
const ELEMENT_TYPES = {
    NODE: 'node',
    EDGE: 'edge',
    WHILE: 'while',
    FOR: 'for'
};

// Language Settings
const DEFAULT_LANGUAGE = 'C';
const LANGUAGE_PATTERNS = {
    'C': {
        'IF_CHECK': /\s*if\s*\(\s*.+\s*\)\s*\{\s*/i,
        'ELSE_IF_CHECK': /\s*\}\s*else\s*if\s*\(\s*.+\s*\)\s*\{\s*/i,
        'ELSE_CHECK': /\s*\}\s*else\s*\{\s*/i,
        'WHILE_CHECK': /\s*while\s*\(\s*.+\s*\)\s*/i,
        'FOR_CHECK': /\s*for\s*\(\s*\s*\)\s*/i, // TODO: Add for loop syntax checking
        'LINE_END': ';',
        'CONDITION_START': '(',
        'CONDITION_END': ')'
    }
};
const CONDITION_TYPES = {
    IF: 'if',
    FOR: 'for',
    WHILE: 'while'
};

// Graph Settings
const STARTING_X = 0;
const STARTING_Y = (cy.height() - NODE_HEIGHT)/2.0;
const NODE_HORIZONTAL_SPACING = 100;
const NODE_VERTICAL_SPACING = 50;

