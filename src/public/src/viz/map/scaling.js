/**
 * [description]
 * @project Square and Buffer DotMaps
 * @author Adriana Zanda <adriana.zanda@fhnw.ch>
 * @date 28.11.2018
 * @version 1.0
 * @description: Scale Polygons
 * @ECMAScript6
 */


"use strict";

function scale(feature, transformFactor) {
	let scaleFactor = transformFactor;

	let centroid = getCentroid(feature);

	let backupFeature = backupCoordinates(feature);
	let scaledFeature = scaleFeature(backupFeature, centroid, scaleFactor);

	return scaledFeature;
}

// berechnet den Centroid/das Center eines Polygons
function getCentroid(feature) {
	let coords = [];
	if (feature.geometry.type === "MultiPolygon") {
		let numOfPoly = feature.geometry.coordinates.length;
		for (let i = 0; i < numOfPoly; i++) {                                             // Erstellt für jeden Multi-Path (jedes Polygon) eine gebufferte Geometrie
			let numOfPoints = feature.geometry.coordinates[i][0].length;
			for (let j = 0; j < numOfPoints; j++) {
				coords.push(feature.geometry.coordinates[i][0][j]);
			}
		}
	} else if (feature.geometry.type === "Polygon") {                                    // Dieser Block wurde nicht getestet, sollte aber auch funktionieren
		let numOfPoints = feature.geometry.coordinates[0].length;
		for (let j = 0; j < numOfPoints; j++) {
			coords.push(feature.geometry.coordinates[0][j]);
		}
	}

	var center = coords.reduce(function (x, y) {
		return [x[0] + y[0] / coords.length, x[1] + y[1] / coords.length]
	}, [0, 0])
	return center;
}


function scaleFeature(feature, centroid, scaleFactor) {          										// scalet alle Polygone eines Features
	feature.geometry.coordinatesScale = [[]];
	feature.geometry.coordinates = [[]];
	if (feature.geometry.type === "MultiPolygon") {
		let numOfPoly = feature.geometry.coordinatesBuffer.length;
		for (let i = 0; i < numOfPoly; i++) {
			let exPolygon = scalePolygon(feature.geometry.coordinatesBuffer[i], centroid, scaleFactor);
			feature.geometry.coordinatesScale[0].push(exPolygon); //Backup Scale
			feature.geometry.coordinates[0].push(exPolygon);
		}
	} else if (feature.geometry.type === "Polygon") {                                    		// Dieser Block wurde nicht getestet, sollte aber auch funktionieren
		let exPolygon = scalePolygon(feature.geometry.coordinatesBuffer, centroid, scaleFactor);
		feature.geometry.coordinatesScale[0].push(exPolygon);	//Backup Scale
		feature.geometry.coordinates[0].push(exPolygon);
	}
	return feature;
}

//Prinzip:
// 1. Normalize each pair of coordinates (coords - centroid)
// 2. Scale the normalized coodinates (coords * factor)
// 3. Add centroid to scaled coordinates (coords + centroid)
function scalePolygon(paths, centroid, scaleFactor) {                                   				// Gibt gescalte Polygone zurück

	let outputPolygon = [];
	let pathLength = paths[0].length;

	for (let k = 0; k < pathLength; k++) {
		let standarizedX = paths[0][k][0] - centroid[0];
		let standarizedY = paths[0][k][1] - centroid[1];

		let multipliedX = standarizedX * scaleFactor;
		let multipliedY = standarizedY * scaleFactor;

		let scaledX = multipliedX + centroid[0];
		let scaledY = multipliedY + centroid[1];

		outputPolygon.push([scaledX, scaledY]);
	}

	return outputPolygon;
}