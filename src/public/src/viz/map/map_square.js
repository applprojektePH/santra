/**
 * [description]
 * @project Square and Buffer DotMaps
 * @author Adriana Zanda <adriana.zanda@fhnw.ch>
 * @date 28.11.2018
 * @version 1.0
 * @description: basic functions for map SQUARE method
 * @description: based on MSc Thesis Thomas Studer 2016
 * @ECMAScript6
 */


"use strict";

function getFirstSquarishAttributes(feature, strokeWidthPolys, offset, cellWidth, cellHeight, BBMap,
    numberOfDotsTarget, minValue, iterator, cloneSelectorList) {

    // gebufferte Flächengeometrien erstellen
    let bufferedFeature = buffer(feature, strokeWidthPolys, offset, cellWidth, cellHeight, BBMap);
    // Punkte_Zielwert dem Feature hinzufügen
    bufferedFeature.properties.value = numberOfDotsTarget;

    return createDotKoo(bufferedFeature, iterator, cloneSelectorList);       //gibt ein Feature mit einem leeren Property für die Grid-Koordinaten der BBox zurück
};


function createDotKoo(feature, iterator, cloneSelectorList) {

    if (feature.geometry.coordinatesBuffer.length > 0) {
        chooseBiggestPolygon(feature);          // selektiert das grösste Polygon eines Features und berechnet zugehörige Werte (Fäche, Index, Schwerpunkt, BB)
        feature.properties.gridKooBBox = {};
    } else {

        if (Math.round(feature.properties.value) > 0) {

            // Sämtliche Flächen werden gezeichnet. Die Punktberechnung wird nur für die verbliebenen Features durchgeführt (=> dort wo eine gebufferte Fläche vorhanden ist)
            console.log(feature.properties.name_short + ": Offset zu Gross. Keine Geometrie vorhanden!");
            let tempArray = [
                "#" + feature.properties.name_short + "_" + iterator,
                feature.properties.name_short
            ]
            cloneSelectorList.push(tempArray);
        }
    }

    return feature;
}

function chooseBiggestPolygon(feature) {                        // selektiert das grösste Polygon eines Features und berechnet zugehörige Werte (Fäche, Index, Schwerpunkt, BB)
    let area = [];                                              // enthält Polygonflächen eines Features unter Berücksichtigung der Enklaven und Löcher
    let numPoly = feature.geometry.coordinatesBuffer.length;
    for (let i = 0; i < numPoly; i++) {
        let tempArea = 0;
        let numArea = feature.geometry.coordinatesBuffer[i].length;
        for (let j = 0; j < numArea; j++) {
            tempArea = tempArea - d3.polygonArea(feature.geometry.coordinatesBuffer[i][j]);
        }
        area[i] = tempArea;
    }
    feature.properties.area = d3.max(area);                                                                             // Flächenberechnung des grössten Polygons
    feature.properties.polygonIndex = area.indexOf(feature.properties.area);                                            // Index des grössten Polygons im Feature
    feature.properties.center = d3.polygonCentroid(feature.geometry.coordinatesBuffer[feature.properties.polygonIndex][0]);   // Schwerpunktbestimmung des grössten Polygons
    let x = [];                                                                                                         // enthält sämtliche x-Koordinaten der Umrandungsfläche des grössten Polygons
    let y = [];                                                                                                         // enthält sämtliche y-Koordinaten der Umrandungsfläche des grössten Polygons
    let numKoo = feature.geometry.coordinatesBuffer[feature.properties.polygonIndex][0].length;
    for (let k = 0; k < numKoo; k++) {
        x[k] = feature.geometry.coordinatesBuffer[feature.properties.polygonIndex][0][k][0];
        y[k] = feature.geometry.coordinatesBuffer[feature.properties.polygonIndex][0][k][1];
    }
    feature.properties.bBox = [[d3.min(x), d3.min(y)], [d3.max(x), d3.max(y)]];                                          // Koordinatenbestimmung der BB des grössten Polygons

    return feature;
}


function initGridKooBBox(feature) {                                     // Initialisiert ein Objekt in welchem die Grid-Koordinaten der BB abgelegt werden
    let numNegCol = Math.floor((feature.properties.bBox[0][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numPosCol = Math.ceil((feature.properties.bBox[1][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numNegRow = Math.floor((feature.properties.bBox[0][1] - feature.properties.center[1]) / feature.properties.gridSize);
    let numPosRow = Math.ceil((feature.properties.bBox[1][1] - feature.properties.center[1]) / feature.properties.gridSize);
    for (let i = 0; i <= (numPosRow - numNegRow); i++) {
        feature.properties.gridKooBBox[numNegRow + i] = {};
        for (let j = 0; j <= (numPosCol - numNegCol); j++) {
            feature.properties.gridKooBBox[numNegRow + i][numNegCol + j] = undefined;
        }
    }

    return feature;
}

function calcGridKooBBox(feature) {                                     // Berechnet die Grid-Koordinaten der BB und legt sie beim Feature unter dem Attribut "gridKooBBox" ab
    let dotKooX, dotKooY;
    let indexX, indexY;
    let numNegCol = Math.floor((feature.properties.bBox[0][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numPosCol = Math.ceil((feature.properties.bBox[1][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numNegRow = Math.floor((feature.properties.bBox[0][1] - feature.properties.center[1]) / feature.properties.gridSize);
    let numPosRow = Math.ceil((feature.properties.bBox[1][1] - feature.properties.center[1]) / feature.properties.gridSize);
    let minX = feature.properties.center[0] + numNegCol * feature.properties.gridSize;
    let minY = feature.properties.center[1] + numNegRow * feature.properties.gridSize;
    for (let i = 0; i <= (numPosCol - numNegCol); i++) {
        dotKooX = minX + i * feature.properties.gridSize;
        indexX = numNegCol + i;
        for (let j = 0; j <= (numPosRow - numNegRow); j++) {
            dotKooY = minY + j * feature.properties.gridSize;
            indexY = numNegRow + j;
            feature.properties.gridKooBBox[indexY][indexX] = [dotKooX, dotKooY];                // Jede Koordinate wird im Objekt, entsprechend ihres Zeilen- und Spaltenindexes bezüglich des Schwerpunkts, abgelegt
        }
    }

    return feature;
}


function selectGridKoo(feature) {                                       // Selektiert sämtliche Grid-Koordinaten die sich innerhalb der Fläche befinden und legt sie beim Feature unter dem Attribut "gridKooArea" ab
    initGridKooArea(feature);                                           // Initialisiert ein Objekt in welchem die Grid-Koordinaten, welche sich innerhalb der Fläche befinden, abgelegt werden
    selectGridKooArea(feature);                                         // Selektiert die Grid-Koordinaten die sich innerhalb der Fläche befinden und legt sie beim Feature unter dem Attribut "gridKooArea" ab
    cleanKoo(feature.properties.gridKooArea);                           // Säubert das Objekt mit den Grid-Koordinaten, entfernt leere Einträge

    return feature;
}

function initGridKooArea(feature) {                                     // Initialisiert ein Objekt in welchem die Grid-Koordinaten, welche sich innerhalb der Fläche befinden, abgelegt werden
    feature.properties.gridKooArea = {};
    let numNegCol = Math.floor((feature.properties.bBox[0][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numPosCol = Math.ceil((feature.properties.bBox[1][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numNegRow = Math.floor((feature.properties.bBox[0][1] - feature.properties.center[1]) / feature.properties.gridSize);
    let numPosRow = Math.ceil((feature.properties.bBox[1][1] - feature.properties.center[1]) / feature.properties.gridSize);
    for (let i = 0; i <= (numPosRow - numNegRow); i++) {
        feature.properties.gridKooArea[numNegRow + i] = {};
        for (let j = 0; j <= (numPosCol - numNegCol); j++) {
            feature.properties.gridKooArea[numNegRow + i][numNegCol + j] = undefined;
        }
    }

    return feature;
}

function selectGridKooArea(feature) {                                   // Selektiert die Grid-Koordinaten die sich innerhalb der Fläche befinden und legt sie beim Feature unter dem Attribut "gridKooArea" ab
    feature.properties.numGridKooArea = 0;                              // Counter um Punktanzahl in Fläche zu zählen
    let pI = feature.properties.polygonIndex;
    let numArea = feature.geometry.coordinatesBuffer[pI].length;
    for (let i = 0; i < numArea; i++) {
        let counter = 0;
        if (i == 0) {                                                   // übergibt sämtliche Punkte innerhalb der Umrandungsfläche dem Attribut "gridKooArea"
            for (let k in feature.properties.gridKooBBox) {
                for (let l in feature.properties.gridKooBBox[k]) {
                    if (d3.polygonContains(feature.geometry.coordinatesBuffer[pI][i], feature.properties.gridKooBBox[k][l]) == true) {
                        feature.properties.gridKooArea[k][l] = feature.properties.gridKooBBox[k][l];
                        counter++;
                    }
                }
            }
        } else if (i != 0) {                                            // entfernt sämtliche Punkte innerhalb der Enklaven oder Löcher aus Attribut "gridKooArea"
            for (let m in feature.properties.gridKooArea) {
                for (let n in feature.properties.gridKooArea[m]) {
                    if (feature.properties.gridKooArea[m][n] != undefined && d3.polygonContains(feature.geometry.coordinatesBuffer[pI][i], feature.properties.gridKooArea[m][n]) == true) {
                        delete feature.properties.gridKooArea[m][n];
                        counter--;
                    }
                }
            }
        }
        feature.properties.numGridKooArea = feature.properties.numGridKooArea + counter;
    }

    return feature;
}

function cleanKoo(koo) {                                                // Säubert das Objekt mit den Grid-Koordinaten, entfernt leere Einträge
    for (let i in koo) {
        for (let j in koo[i]) {
            if (koo[i][j] == undefined) {
                delete koo[i][j];
            }
        }
        if (Object.keys(koo[i]).length < 1) {
            delete koo[i];
        }
    }

    return koo;
}


function setGrid(feature) {                                             // Erstellt ein Grid mit kleinster Maschenweite und dessen Knoten in der Fläche sind
    feature.properties.gridKooArea = {};                                // leert das Attribut "gridKooArea"
    initGridKooBBox(feature);                                           // Initialisiert ein Objekt in welchem die Grid-Koordinaten der BB abgelegt werden
    calcGridKooBBox(feature);                                           // Berechnet die Grid-Koordinaten der BB und legt sie beim Feature unter dem Attribut "gridKooBBox" ab
    selectGridKoo(feature);                                             // Selektiert sämtliche Grid-Koordinaten die sich innerhalb der Fläche befinden und legt sie beim Feature unter dem Attribut "gridKooArea" ab

    return feature;
}

function setPoints(feature, iterator, cloneSelectorList) {              // Selektiert die Grid-Koordinaten bei welchen ein Punkt dargestellt wird
    let neededPoints = Math.round(feature.properties.value);
    let possiblePoints = feature.properties.numGridKooArea;

    if (possiblePoints > neededPoints) {

        initGridKooPoints(feature);                                     // Initialisiert ein Objekt in welchem die darzustellenden Punkt-Koordinaten abgelegt werden
        // Blockwerte berechnen
        let counter = 0;                                                // Counter, zählt die Anzahl bereits gesetzter Punkte
        let w = Math.ceil(Math.sqrt(feature.properties.value));         // Block-Breite
        let h = Math.floor(feature.properties.value / w);               // Block-Höhe
        let wNeg, wPos;
        let hNeg, hPos;
        if (w % 2 == 0) {
            wNeg = w / 2 * -1;
            wPos = w / 2 - 1;
        } else {
            wNeg = (w - 1) / 2 * -1;
            wPos = (w - 1) / 2;
        }
        if (h % 2 == 0) {
            hNeg = h / 2 * -1;
            hPos = h / 2 - 1;
        } else {
            hNeg = (h - 1) / 2 * -1;
            hPos = (h - 1) / 2;
        }
        // Basisblock erstellen (dieser hat vollständig gefüllte Zeilen und Spalten, soweit die Flächenform dies zulässt)
        for (let i = hNeg; i <= hPos; i++) {                            // Selektiert Zeile
            for (let j = wNeg; j <= wPos; j++) {                        // Selektiert Position in Zeile
                if (feature.properties.gridKooArea[i] != undefined && feature.properties.gridKooArea[i][j] != undefined) {
                    feature.properties.gridKooPoints[i][j] = feature.properties.gridKooArea[i][j];                          // Falls Grid-Koordinate vorhanden wird Punkt gesetzt
                    counter++;
                }
            }
        }
        // Der Block wird analysiert und eine Zeile weiter oben wird versucht die restlichen Punkte zu platzieren
        for (let k = wNeg; k <= wPos && feature.properties.value > counter; k++) {                  // Falls noch nicht genügend Punkte, Selektiert Position in oberster Blockzeile (hPos+1)
            if (feature.properties.gridKooArea[hPos + 1] != undefined && feature.properties.gridKooArea[hPos + 1][k] != undefined) {
                feature.properties.gridKooPoints[hPos + 1][k] = feature.properties.gridKooArea[hPos + 1][k];                    // Falls Grid-Koordinate vorhanden wird Punkt gesetzt
                counter++;
            }
            if (k == wPos || feature.properties.value == counter) {
                hPos++;
            } // aktualisiert Index der obersten Zeile
        }
        for (let l = 1; counter < feature.properties.value; l++) {      // Falls noch nicht genügend Punkte gesetzt, so wird eine ganze Zeile oder Spalte hinzugefügt, bis es zuviele oder genau soviele Punkte hat wie benötigt
            stop++;
            if (l % 4 == 0) {                                           // linke Spalte hinzufügen
                for (let m = hNeg; m <= hPos; m++) {
                    if (feature.properties.gridKooArea[m] != undefined && feature.properties.gridKooArea[m][wNeg - 1] != undefined) {
                        feature.properties.gridKooPoints[m][wNeg - 1] = feature.properties.gridKooArea[m][wNeg - 1];
                        counter++;
                    }
                }
                wNeg--;                                                 // aktualisiert Index der linkesten Spalte
            } else if ((l + 1) % 4 == 0) {                              // obere Zeile hinzufügen
                for (let m = wNeg; m <= wPos; m++) {
                    if (feature.properties.gridKooArea[hPos + 1] != undefined && feature.properties.gridKooArea[hPos + 1][m] != undefined) {
                        feature.properties.gridKooPoints[hPos + 1][m] = feature.properties.gridKooArea[hPos + 1][m];
                        counter++;
                    }
                }
                hPos++;                                                  // aktualisiert Index der obersten Zeile
            } else if ((l + 2) % 4 == 0) {                               // rechte Spalte hinzufügen
                for (let m = hNeg; m <= hPos; m++) {
                    if (feature.properties.gridKooArea[m] != undefined && feature.properties.gridKooArea[m][wPos + 1] != undefined) {
                        feature.properties.gridKooPoints[m][wPos + 1] = feature.properties.gridKooArea[m][wPos + 1];
                        counter++;
                    }
                }
                wPos++;                                                  // aktualisiert Index der rechtesten Spalte
            } else if ((l + 3) % 4 == 0) {                               // untere Zeile hinzufügen
                for (let m = wNeg; m <= wPos; m++) {
                    if (feature.properties.gridKooArea[hNeg - 1] != undefined && feature.properties.gridKooArea[hNeg - 1][m] != undefined) {
                        feature.properties.gridKooPoints[hNeg - 1][m] = feature.properties.gridKooArea[hNeg - 1][m];
                        counter++;
                    }
                }
                hNeg--;                                                  // aktualisiert Index der untersten Zeile
            }
        }
        for (let n = 0; counter > feature.properties.value; n++) {       // löschen überschüssiger Punkte aus der obersten Zeile
            if (feature.properties.gridKooPoints[hPos] != undefined) {   // Falls Zeile vorhanden, Punkte löschen
                feature.properties.gridKooPoints[hPos][wPos - n] == undefined;
                counter--;
            } else {                                                     // Falls Zeile nicht vorhanden, nächst tiefere Zeile setzen
                hPos--;
            }
        }
        cleanKoo(feature.properties.gridKooPoints);                      // Säubert das Objekt mit den Grid-Koordinaten, entfernt leere Einträge

    } else if (possiblePoints === neededPoints) {
        feature.properties.gridKooPoints = feature.properties.gridKooArea;
    } else {

        feature.properties.gridKooPoints = [];

        console.log(feature.properties.name_short + ": zu klein");
        let tempArray = [
            "#" + feature.properties.name_short + "_" + iterator,
            feature.properties.name_short
        ]
        cloneSelectorList.push(tempArray);

    }

    return feature;
}

function initGridKooPoints(feature) {                                   // Initialisiert ein Objekt in welchem die darzustellenden Punkt-Koordinaten abgelegt werden
    feature.properties.gridKooPoints = {};
    let numNegCol = Math.floor((feature.properties.bBox[0][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numPosCol = Math.ceil((feature.properties.bBox[1][0] - feature.properties.center[0]) / feature.properties.gridSize);
    let numNegRow = Math.floor((feature.properties.bBox[0][1] - feature.properties.center[1]) / feature.properties.gridSize);
    let numPosRow = Math.ceil((feature.properties.bBox[1][1] - feature.properties.center[1]) / feature.properties.gridSize);
    for (let i = 0; i <= (numPosRow - numNegRow); i++) {
        feature.properties.gridKooPoints[numNegRow + i] = {};
        for (let j = 0; j <= (numPosCol - numNegCol); j++) {
            feature.properties.gridKooPoints[numNegRow + i][numNegCol + j] = undefined;
        }
    }

    return feature;
}


function constructDotKooArray(geojson) {                                // Setzt die Punktkoordinaten der verschiedenen Features in einem Array für d3 zusammen
    let dotKooDef = [];
    for (let j in geojson.properties.gridKooPoints) {
        for (let k in geojson.properties.gridKooPoints[j]) {
            dotKooDef.push(geojson.properties.gridKooPoints[j][k]);
        }
    }

    return dotKooDef;
}
