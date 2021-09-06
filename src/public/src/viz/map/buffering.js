/**
 * [description]
 * @project Square and Buffer DotMaps
 * @version 2.0
 * @author Adriana Zanda <adriana.zanda@fhnw.ch>
 * @date 28.11.2018
 * 
 * @version 1.0
 * @author Philipp Meyer <philipp.meyer@fhnw.ch>
 * @date 20.06.2017
 * @description: based on MSc Thesis Thomas Studer 2016
 * @ECMAScript6
 */


"use strict";

// cellWidth:       Breite des Darstellungsfensters 
// cellHeight:      Höhe des Darstellungsfensters 
// dotRadius:       Punktradius in "pt"-Einheiten
// borderWidth:     Liniendicke der darzustellenden Flächen
// offset:          Parameter um den minimalen Abstand der Punkte zur Flächengrenze zu vergrössern. 0 bedeutet, Punkte können Flächengrenze berühren.
// dotRadius, borderWidth und offset werden in Bildschirm-Einheiten, also "px" oder "pt" übergeben. Aus diesen drei Werten setzt sich der Buffer zusammen.

function buffer(feature, strokeWidthPolys, offset, cellWidth, cellHeight, BBMap) {
	let dotRadius = 1;                       	// Zuweisen des Punktradius (in "pt"-Einheiten)
	let borderWidth = strokeWidthPolys;         // Zuweisen der Liniendicke für die darzustellenden Flächen (in "px"-Einheiten)
	let offsetToBorder = offset;                // Parameter um den minimalen Abstand der Punkte zur Flächengrenze zu vergrössern (in "px"-Einheiten). 0 bedeutet, Punkte können Flächengrenze berühren.

	let backupFeature = backupCoordinates(feature);
	let clipper = formatFeature(backupFeature);												//wandelt ein (Multi-)Polygon (jeweils ein Kanton) ins ClipperJS Path-Format um
	let buffer = offsetFeature(clipper, 100, dotRadius, cellWidth, cellHeight, BBMap, borderWidth, offsetToBorder);		//scale = 100, um zwei Nachkommastellen auszugleichen
	return reformatFeature(buffer);
}

// da zum Teil mehrere Karten dargestellt werden können, müssen die Originalkoordinaten "gebackuped/reassigned" werden
function backupCoordinates(feature) {
	let featureCopy = JSON.parse(JSON.stringify(feature));

	let polyLength = featureCopy.geometry.coordinates.length;
	feature.geometry.coordinatesBuffer = [];
	for (let i = 0; i < polyLength; i++) {
		feature.geometry.coordinatesBuffer.push(featureCopy.geometry.coordinates[i]);
	}
	return feature;
}

function backupOrigCoordinates(feature) {
	let featureCopy = JSON.parse(JSON.stringify(feature));

	let polyLength = featureCopy.geometry.coordinatesBuffer.length;
	feature.geometry.coordinatesOrig = [];
	for (let i = 0; i < polyLength; i++) {
		feature.geometry.coordinatesOrig.push(featureCopy.geometry.coordinatesBuffer[i]);
	}
	return feature;
}

function reassignOrigCoords(feature) {
	let featureCopy = JSON.parse(JSON.stringify(feature));

	let polyLength = featureCopy.geometry.coordinatesOrig.length;
	feature.geometry.coordinates = [];
	for (let i = 0; i < polyLength; i++) {
		feature.geometry.coordinates.push(featureCopy.geometry.coordinatesOrig[i]);
	}
	return feature;
}

function formatFeature(feature) {                                       // Formatiert Feature-Geometrien nach Clipper Geometrie-Format
	if (feature.geometry.type === "MultiPolygon") {                     // Formatiert MultiPolygon
		let numPoly = feature.geometry.coordinatesBuffer.length;
		for (let i = 0; i < numPoly; i++) {								//für jedes Polygon eines Features/Kantons
			formatPolygon(feature.geometry.coordinatesBuffer[i]);       // Übergabeparameter: polygon [[[2, 2],...,[23, 45]],...,[[34, 0],...,[56, 12]]]
		}
	} else if (feature.geometry.type === "Polygon") {                   // Formatiert Polygon (Dieser Block wurde nicht getestet, sollte aber auch funktionieren)
		formatPolygon(feature.geometry.coordinatesBuffer);              // Übergabeparameter: polygon [[[2, 2],...,[23, 45]],...,[[34, 0],...,[56, 12]]]
	}
	return feature;
}

function formatPolygon(polygon) {                                       // Formatiert Polygon-Geometrien zu Clipper Paths-Format
	let polygonCopy = JSON.parse(JSON.stringify(polygon));
	let numArea = polygonCopy.length;
	for (let k = 0; k < numArea; k++) {                                 // Formatiert und setzt die Koordinaten zu einem Clipper Multi-Path-Object zusammen
		let numPoints = polygonCopy[k].length;                          // Multi-Path [[{"X":2,"Y":3},...,{"X":1,"Y":5}],...,[{"X":6,"Y":3},...,{"X":7,"Y":4}]]
		polygon[k] = [];
		for (let j = 0; j < numPoints; j++) {                                                 // Setzt die formatierten Koordinaten zu einem Clipper Path-Object zusammen
			polygon[k].push({ "X": polygonCopy[k][j][0], "Y": polygonCopy[k][j][1] });          // Path [{"X":2,"Y":3},...,{"X":1,"Y":5}]
		}
	}
	return polygon;
}


function offsetFeature(feature, scale, r, w, h, BBMap, borderWidth, offsetToBorder) {         // Buffert Geometrien eines Features (Multipolygon des Kantons) und legt sie beim Feature unter dem Attribut "tempGeometry" als Multi-Path ab
	feature.properties.tempGeometry = [];
	if (feature.geometry.type === "MultiPolygon") {
		let numOfPoly = feature.geometry.coordinatesBuffer.length;
		for (let i = 0; i < numOfPoly; i++) {                                           // Erstellt für jeden Multi-Path (jedes Polygon) eine gebufferte Geometrie
			let exPolygon = scalePaths(feature.geometry.coordinatesBuffer[i], scale, r, w, h, BBMap, borderWidth, offsetToBorder);        // Übergabeparameter: Multi-Path [[{"X":2,"Y":3},...,{"X":1,"Y":5}],...,[{"X":6,"Y":3},...,{"X":7,"Y":4}]]
			let numExP = exPolygon.length;                                              // Rückgabeparameter: Multi-ExPolygon [{"outer":[{"X":2,"Y":3},...,{"X":1,"Y":5}],"holes":[[{"X":6,"Y":3},...,{"X":7,"Y":4}],...,[{"X":2,"Y":3},...,{"X":1,"Y":4}]]},...,{...}]
			for (let j = 0; j < numExP; j++) {                                          // Setzt mehrere Multi-ExPolygons zu einem Multi-ExPolygon zusammen
				feature.properties.tempGeometry.push(exPolygon[j]);                     // Temporäre Geometrie für ein Feature: Multi-ExPolygon [{"outer":[{"X":2,"Y":3},...,{"X":1,"Y":5}],"holes":[[{"X":6,"Y":3},...,{"X":7,"Y":4}],...,[{"X":2,"Y":3},...,{"X":1,"Y":4}]]},...,{...}]
			}
		}
	} else if (feature.geometry.type === "Polygon") {                                   // Dieser Block wurde nicht getestet, sollte aber auch funktionieren
		let exPolygon = scalePaths(feature.geometry.coordinatesBuffer, scale, r, w, h, BBMap, borderWidth, offsetToBorder);               // Übergabeparameter: Multi-Path [[{"X":2,"Y":3},...,{"X":1,"Y":5}],...,[{"X":6,"Y":3},...,{"X":7,"Y":4}]]
		let numExP = exPolygon.length;                                                  // Rückgabeparameter: Multi-ExPolygon [{"outer":[{"X":2,"Y":3},...,{"X":1,"Y":5}],"holes":[[{"X":6,"Y":3},...,{"X":7,"Y":4}],...,[{"X":2,"Y":3},...,{"X":1,"Y":4}]]},...,{...}]
		for (let j = 0; j < numExP; j++) {
			feature.properties.tempGeometry.push(exPolygon[j]);                         // Temporäre Geometrie für ein Feature: Multi-ExPolygon [{"outer":[{"X":2,"Y":3},...,{"X":1,"Y":5}],"holes":[[{"X":6,"Y":3},...,{"X":7,"Y":4}],...,[{"X":2,"Y":3},...,{"X":1,"Y":4}]]},...,{...}]
		}
	}
	return feature;
}

function scalePaths(paths, scale, r, w, h, BBMap, bW, oB) {                             // Gibt gebufferte Geometrien als Multi-Path zurück

	ClipperLib.JS.ScaleUpPaths(paths, scale);                           				// Die Clipper-Library kann nur mit Integer umgehen. Daher werden die Koordinaten - abhaengig der gewuensten Anzahl Nachkommastellen - mit 10^x multipliziert.
	// Übergabeparameter: Multi-Path [[{"X":2,"Y":3},...,{"X":1,"Y":5}],...,[{"X":6,"Y":3},...,{"X":7,"Y":4}]]
	let miterLimit = 2;
	let arcTolerance = 100;
	let co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
	co.AddPaths(paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
	let offset = -(r / 3 * 4 + bW / 2 + oB) * ownProjection(w, h, BBMap, "scale");          	// Rechnet den Offset in "px" in Projektions-Einheiten um
	let offsetPolytree = new ClipperLib.PolyTree();
	co.Execute(offsetPolytree, offset * scale);
	let offsetExpolygon = ClipperLib.JS.PolyTreeToExPolygons(offsetPolytree);
	let numExPoly = offsetExpolygon.length;
	for (let k = 0; k < numExPoly; k++) {                                  				// Rechnet die Integer-Werte ins ursprüngliche Format zurück. Daher werden die Koordinaten - abhaengig der gewuensten Anzahl Nachkommastellen - mit 10^x dividiert.
		let numOuterKoo = offsetExpolygon[k].outer.length;
		for (let l = 0; l < numOuterKoo; l++) {
			offsetExpolygon[k].outer[l].X = offsetExpolygon[k].outer[l].X / scale;
			offsetExpolygon[k].outer[l].Y = offsetExpolygon[k].outer[l].Y / scale;
		}
		let numHoles = offsetExpolygon[k].holes.length;
		for (let m = 0; m < numHoles; m++) {
			let numHoleKoo = offsetExpolygon[m].holes[m].length;
			for (let n = 0; n < numHoleKoo; n++) {
				offsetExpolygon[m].holes[m][n].X = offsetExpolygon[m].holes[m][n].X / scale;
				offsetExpolygon[m].holes[m][n].Y = offsetExpolygon[m].holes[m][n].Y / scale;
			}
		}
	}
	return offsetExpolygon;                                                             // Rückgabeparameter: Multi-ExPolygon [{"outer":[{"X":2,"Y":3},...,{"X":1,"Y":5}],"holes":[[{"X":6,"Y":3},...,{"X":7,"Y":4}],...,[{"X":2,"Y":3},...,{"X":1,"Y":4}]]},...,{...}]
}


function reformatFeature(feature) {                                     				// Formatiert Clipper-Geometrien nach GEOJSON Geometrie-Format zurück
	if (feature.geometry.type === "MultiPolygon") {                                     // Reformatiert MultiPolygon
		let numberOfPoly = feature.properties.tempGeometry.length;
		feature.geometry.coordinatesBuffer = [];
		for (let i = 0; i < numberOfPoly; i++) {
			feature.geometry.coordinatesBuffer[i] = reformatPolygon(feature.properties.tempGeometry[i]);        // Übergabeparameter: ExPolygon [{"outer":[{"X":2,"Y":3},...,{"X":1,"Y":5}],"holes":[[{"X":6,"Y":3},...,{"X":7,"Y":4}],...,[{"X":2,"Y":3},...,{"X":1,"Y":4}]]}]
		}
	} else {                                                                            // Reformatiert Polygon (Dieser Block wurde nicht getestet, sollte aber auch funktionieren)
		feature.geometry.coordinatesBuffer = reformatPolygon(feature.properties.tempGeometry);
	}

	return feature;
}

function reformatPolygon(exPolygon) {                                   // ExPolygon in Exterior und Interiors aufteilen. Exterior umformatieren. Interiors aufteilen. Nach Umformatierung alles zu Polygon zusammenfassen und zurückgeben.
	let polygon = [];
	let exterior = [];
	let numPoints = exPolygon.outer.length;                             // Reformatiert Path (Exterior) zu area
	for (let k = 0; k < numPoints; k++) {                               // Übergabeparameter: Path (Exterior) [{"X":2,"Y":2},...,{"X":23,"Y":45}]
		exterior.push([exPolygon.outer[k].X, exPolygon.outer[k].Y]);    // Rückgabeparameter: area [[2, 2],...,[23, 45]]
	}
	exterior.push(exterior[0]);                                         // um GEOJSON-Konvention zu entsprechen, muessen die erste und letze Koordinaten gleich sein, diese wird hier angefügt: area [[2, 2],...,[23, 45],[2, 2]]
	polygon.push(exterior);
	let numPolygon = exPolygon.holes.length;
	for (let j = 0; j < numPolygon; j++) {                              // Reformatiert jeden Path (Interior) zu area
		polygon.push(solveInterior(exPolygon.holes[j]));                // Übergabeparameter: Path (Interior): [{"X":2,"Y":3},...,{"X":1,"Y":5}]
	}                                                                   // Rügabeparameter: area [[2, 2],...,[23, 45],[2, 2]]
	return polygon;                                                     // Rückgabeparameter: Polygon [[[2, 2],...,[23, 45],[2, 2]],...,[[34, 0],...,[56, 12],[34, 0]]]
}

function solveInterior(polygon) {                                       // Interior umformatieren. Nach Umformatierung alles zu Area zusammenfassen und zurückgeben.
	let interior = [];
	let numPoints = polygon.length;                                     // Reformatiert Path (Interior) zu area
	for (let l = 0; l < numPoints; l++) {                               // Übergabeparameter: Path (Exterior) [{"X":2,"Y":2},...,{"X":23,"Y":45}]
		interior.push([polygon[l].X, polygon[l].Y]);                    // Rückgabeparameter: area [[2, 2],...,[23, 45]]
	}
	interior.push(interior[0]);                                         // um GEOJSON-Konvention zu entsprechen, muessen die erste und letze Koordinaten gleich sein, diese wird hier angefügt: area [[2, 2],...,[23, 45],[2, 2]]
	return interior;                                                    // Rückgabeparameter: area [[2, 2],...,[23, 45],[2, 2]]
}


function ownProjection(w, h, bBoxMap, mode, data) {
	let mScale = (bBoxMap[1][0] - bBoxMap[0][0]) / w;                       // Skalierungsfaktor x-Achse
	let nScale = (bBoxMap[1][1] - bBoxMap[0][1]) / h;                       // Skalierungsfaktor y-Achse

	if (mode === "scale") {                                             // gibt Skalierungsfaktor aus
		return d3.max([mScale, nScale]);
	}
	/* else if (mode === "geojson"){                                  	// gibt projizierte geojson-Koordinaten aus
		return d3.geoTransform({point: function(x,y) {
			if (mScale >= nScale) {                                     // Wahl des groesseren Skalierungsfaktors (damit Karte vollstaendig innerhalb SVG-Element)
				x = (x - bBoxMap[0][0]) / mScale;
				y = ((y - bBoxMap[0][1]) / mScale + (h - (bBoxMap[1][1] - bBoxMap[0][1]) / mScale) / 2) * -1 + h;
			} else {
				x = (x - bBoxMap[0][0]) / nScale + (w  - (bBoxMap[1][0] - bBoxMap[0][0]) / nScale) / 2;
				y = ((y - bBoxMap[0][1]) / nScale) * -1 + h;
			}
			this.stream.point(x, y);
		}
		});
	} else if (mode === "array") {                                      // gibt transformierte Array-Koordinaten aus
		let x, y;
		if (mScale >= nScale) {                                         // Wahl des groesseren Skalierungsfaktors (damit Karte vollstaendig innerhalb SVG-Element)
			x = (data[0] - bBoxMap[0][0]) / mScale;
			y = ((data[1] - bBoxMap[0][1]) / mScale + (h - (bBoxMap[1][1] - bBoxMap[0][1]) / mScale) / 2) * -1 + h;
		} else {
			x = (data[0] - bBoxMap[0][0]) / nScale + (w  - (bBoxMap[1][0] - bBoxMap[0][0]) / nScale) / 2;
			y = ((data[1] - bBoxMap[0][1]) / nScale) * -1 + h;
		}
		return [x, y];
	} else if (mode === "subarray") {                                   // gibt transformierte Array-Koordinaten aus Subarrays aus
		let x, y;
		let a = [];
		if (mScale >= nScale) {                                         // Wahl des groesseren Skalierungsfaktors (damit Karte vollstaendig innerhalb SVG-Element)
			for (let i = 0; i < data.length; i++ ) {
				x = (data[i][0] - bBoxMap[0][0]) / mScale;
				y = ((data[i][1] - bBoxMap[0][1]) / mScale + (h - (bBoxMap[1][1] - bBoxMap[0][1]) / mScale) / 2) * -1 + h;
				a.push([x, y]);
			}
		} else {
			for (let i = 0; i < data.length; i++) {
				x = (data[i][0] - bBoxMap[0][0]) / nScale + (w  - (bBoxMap[1][0] - bBoxMap[0][0]) / nScale) / 2;
				y = ((data[i][1] - bBoxMap[0][1]) / nScale) * -1 + h;
				a.push([x, y]);
			}
		}
		return a;
	}*/
}