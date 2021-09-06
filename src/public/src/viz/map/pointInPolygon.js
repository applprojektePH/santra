/**
 * Created by philipp.meyer on 06.06.2016.
 */

/**
 * Function to check if point is in Polygon
 * @param point
 * @param polygon
 * @returns {boolean}
 */
function pointInPolygon(point, polygon) {

	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	// Jordan Curve Theorem

	let xi, xj, yi, yj, intersect;
	let x = point[0];
	let y = point[1];
	let inside = false;

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		xi = polygon[i][0];
		yi = polygon[i][1];
		xj = polygon[j][0];
		yj = polygon[j][1];
		intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) {
			inside = !inside;
		}
	}
	return inside;
}


