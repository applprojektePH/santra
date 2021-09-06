/**
 * Library to generate custom symbols as svg paths
 * @project AlterspyramideDots
 * @author Philipp Meyer <philipp.meyer@fhnw.ch>
 * @date 11.05.2017
 * @version 3.2
 */


// array to store the svg paths
let symbol = [];
// default size of symbols (dimension: width)
const defaultSize = 17;
const bigSize = 25;

/**
 * function that defines a svg path for a circle
 * @param radius		radius of the circle
 * @returns {string}	svg path as a string
 */
let createCirclePath = function(radius) {
	// definition of a arc: http://svg.tutorial.aptico.de/start3.php?knr=10&kname=Pfade&uknr=10.8&ukname=A%20und%20a%20-%20Bogenkurven
	// Move to (x,y), A (ellipse radius x, radius y, rotation around x axis, shorter (0) or longer (1) path around ellipse, ccw (0) or cw (1), end coordinates(x,y))
	return `M${radius},0A${radius},${radius},0,1,1,-${radius},0A${radius},${radius},0,1,1,${radius},0`;
};

/**
 * function that defines a svg path for a rectangle
 * @param length		half of a side length
 * @returns {string}	svg path as a string
 */
let createRectanglePath = function(length) {
	return `M-${length},-${length}L-${length},${length}L${length},${length}L${length},-${length}Z`;
};

/**
 * function that defines a svg path for a rhombus
 * @param length		half of the width (circumradius)
 * @returns {string}	svg path as a string
 */
let createRhombusPath = function(length) {
	return `M-${length},0L0,-${length}L${length},0L0,${length}Z`;
};

/**
 * function that defines a svg path for a pentagon
 * @param radius		circumradius of pentagon
 * @returns {string}	svg path as a string
 */
let createPentagonPath = function(radius) {
	// number of edges
	const edges = 5;
	// start direction, defined from direction east (cw)
	const startDirection = -Math.PI/2; // starts on top
	// angle between edges (from center point)
	const angle = Math.PI*2/edges;
	// coordinate calculation of first edge
	let startX = radius * Math.cos(startDirection);
	let startY = radius * Math.sin(startDirection);
	// definition of the svg path
	let path = `M${startX},${startY}`;
	for (let j = 1; j < edges; j++) {
		// calculation of each edge coordinates
		let x = radius * Math.cos(angle * j + startDirection);
		let y = radius * Math.sin(angle * j + startDirection);
		path += `L${x},${y}`;
	}
	path += `Z`;
	return path;
};

// save basic geometry functions in an array
let basicGeometries = [];
basicGeometries["circle"] = createCirclePath;
basicGeometries["rectangle"] = createRectanglePath;
basicGeometries["rhombus"] = createRhombusPath;
basicGeometries["pentagon"] = createPentagonPath;


/**
 * function that defines the symbol type number 1
 * @param basicGeometry	basicGeometry of symbol
 * @param size			size of symbol (default defined)
 * @returns {String}	svg path of symbol
 */
let Symbol1 = function(basicGeometry, size=defaultSize) {
	return basicGeometries[basicGeometry](size / 2);
};

/**
 * function that defines the symbol type number 2
 * @param basicGeometry	basicGeometry of symbol
 * @param size			size of symbol (default defined)
 * @returns {String}	svg path of symbol
 */
let Symbol2 = function(basicGeometry, size=defaultSize) {
	let path = "";
	path += basicGeometries[basicGeometry](size / 2);
	path += basicGeometries[basicGeometry](size / 4);
	return path;
};

/**
 * function that defines the symbol type number 3
 * @param basicGeometry	basicGeometry of symbol
 * @param size			size of symbol (default defined)
 * @returns {String}	svg path of symbol
 */
let Symbol3 = function(basicGeometry, size=defaultSize) {
	let path = "";
	path += basicGeometries[basicGeometry](size / 2);
	path += basicGeometries[basicGeometry](size / 12 * 5);
	path += basicGeometries[basicGeometry](size / 4);
	return path;
};

/**
 * function that defines the symbol type number 4
 * @param basicGeometry	basicGeometry of symbol
 * @param size			size of symbol (default defined)
 * @returns {String}	svg path of symbol
 */
let Symbol4 = function(basicGeometry, size=defaultSize) {
	let path = "";
	path += basicGeometries[basicGeometry](size / 2);
	path += basicGeometries[basicGeometry](size / 12 * 5);
	return path;
};

/**
 * function that defines the symbol type number 5
 * @param basicGeometry	basicGeometry of symbol
 * @param size			size of symbol (default defined)
 * @returns {String}	svg path of symbol
 */
let Symbol5 = function(basicGeometry, size=bigSize) {
	return basicGeometries[basicGeometry](size / 3);
};


// create each symbol type for basic geometry circle
let circles = [[],
	Symbol1("circle"),
	Symbol2("circle"),
	Symbol3("circle"),
	Symbol4("circle"),
	Symbol5("circle")
];
// add sub array to main array
symbol["circle"] = circles;


// create each symbol type for basic geometry rectangle
let rectangleSize = 14;
let rectangles = [[],
	Symbol1("rectangle", rectangleSize),
	Symbol2("rectangle", rectangleSize),
	Symbol3("rectangle", rectangleSize),
	Symbol4("rectangle", rectangleSize),
	Symbol5("rectangle", rectangleSize)
];
// add sub array to main array
symbol["rectangle"] = rectangles;


// create each symbol type for basic geometry rhombus
let rhombuses = [[],
	Symbol1("rhombus"),
	Symbol2("rhombus"),
	Symbol3("rhombus"),
	Symbol4("rhombus"),
	Symbol5("rhombus")
];	// add sub array to main array
symbol["rhombus"] = rhombuses;


// create each symbol type for basic geometry pentagon
let pentagons = [[],
	Symbol1("pentagon"),
	Symbol2("pentagon"),
	Symbol3("pentagon"),
	Symbol4("pentagon"),
	Symbol5("pentagon")
];
// add sub array to main array
symbol["pentagon"] = pentagons;
