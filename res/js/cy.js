/* * * * * * *
 * Constants *
 * * * * * * */
// Node Settings
const NODE_HEIGHT = 100;
const NODE_WIDTH = 100;

// Graph Settings
const NODE_SEPARATION = 50;
const RANK_SEPARATION = 125;
const RANK_DIRECTION = 'LR';
const MARGIN_X = 0;
const MARGIN_Y = 0;


/* * * * * * * * * * * * *
 * Cytoscape Main Object *
 * * * * * * * * * * * * */
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
                'label': 'data(label)',
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

