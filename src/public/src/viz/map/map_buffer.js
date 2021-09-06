/**
 * [description]
 * @project Square and Buffer DotMaps
 * @version 1.0
 * @author Adriana Zanda <adriana.zanda@fhnw.ch>
 * @description: basic functions for map BUFFER method
 * @date 28.11.2018
 */

// return the dots for the buffer(function)
function getRightNumberOfDotsBuffer(feature, strokeWidthPolys, offset, cellWidth, cellHeight, BBMap, coordinateSystem, pointGap, numberOfDotsTarget, name_short, iterator, cloneSelectorList) {

    let firstBufferedFeature = buffer(feature, strokeWidthPolys, offset, cellWidth, cellHeight, BBMap);
    let [dots, maxNumberOfDots] = getDotsWithinBuffer(firstBufferedFeature, coordinateSystem, pointGap);                                    //Finde die maximal mögliche Anzahl Punkte pro Kanton
    let currentBuffer = { size: offset + 0.1, dots: 0 };                                                                  //urpsrünglich statt offset > 3.1
    let previousBuffer1 = { size: offset, dots: maxNumberOfDots };                                                        //urpsrünglich statt offset > 3
    let previousBuffer2 = { size: 200, dots: 0 };
    let roundedNumberOfTargetDots = Math.round(numberOfDotsTarget);
    let counter = 0;

    if (maxNumberOfDots < roundedNumberOfTargetDots) {

        console.log(`${name_short}: zu klein`);
        let tempArray = [
            "#" + feature.properties.name_short + "_" + iterator,
            feature.properties.name_short
        ]
        cloneSelectorList.push(tempArray);
        return [];

    } else if (roundedNumberOfTargetDots === 0) {
        return [];
    } else {

        while (roundedNumberOfTargetDots !== currentBuffer.dots && counter <= 30) {                                                                                                            //iteriere bis counter = 30 und Punkte im currentBuffer = SOLL-Punkte

            let modifiableGeojsonFeature = feature;
            let geojsonBufferedFeatureNew = buffer(modifiableGeojsonFeature, strokeWidthPolys, currentBuffer.size, cellWidth, cellHeight, BBMap);
            [dots, currentBuffer.dots] = getDotsWithinBuffer(geojsonBufferedFeatureNew, coordinateSystem, pointGap);

            if (previousBuffer1.dots >= roundedNumberOfTargetDots && roundedNumberOfTargetDots > currentBuffer.dots) {
                previousBuffer2.size = currentBuffer.size;
                currentBuffer.size = (previousBuffer1.size + currentBuffer.size) / 2;
            } else {
                previousBuffer1.size = currentBuffer.size;
                currentBuffer.size = (previousBuffer2.size + currentBuffer.size) / 2;
            }

            counter++;

        }

        while ((roundedNumberOfTargetDots !== currentBuffer.dots && (roundedNumberOfTargetDots + 1) !== currentBuffer.dots && (roundedNumberOfTargetDots - 1) !== currentBuffer.dots)
            && (counter > 30 && counter <= 100)) {                                                                                                                                          //iteriere so lange (counter zw. 30&100) bis Punkte im currentBuffer +/- 1 der Anzahl SOLL-Punkte entspricht

            let modifiableGeojsonFeature = feature;
            let geojsonBufferedFeatureNew = buffer(modifiableGeojsonFeature, strokeWidthPolys, currentBuffer.size, cellWidth, cellHeight, BBMap);
            [dots, currentBuffer.dots] = getDotsWithinBuffer(geojsonBufferedFeatureNew, coordinateSystem, pointGap);

            if (previousBuffer1.dots >= roundedNumberOfTargetDots && roundedNumberOfTargetDots > currentBuffer.dots) {
                previousBuffer2.size = currentBuffer.size;
                currentBuffer.size = (previousBuffer1.size + currentBuffer.size) / 2;
            } else {
                previousBuffer1.size = currentBuffer.size;
                currentBuffer.size = (previousBuffer2.size + currentBuffer.size) / 2;
            }

            counter++;
            if (counter === 100) {
                console.info("Too many iterations for canton " + `${name_short}`);
                break;
            }

        }

        return dots;
    }

}

// returns the dots lying within the polygon
function getDotsWithinBuffer(feature, coordSystem, pointGap) {

    let dots = [];
    let counter = 0;

    let numOfBufferPolys = feature.geometry.coordinatesBuffer.length;
    for (let p = 0; p < numOfBufferPolys; p++) {
        let polygon = feature.geometry.coordinatesBuffer[p][0];

        let startPoint;
        let endPoint;

        if (coordSystem === "LV03") {
            //LV03
            startPoint = [450000, 60000]; //Boundingbox min
            endPoint = [850000, 300000]; //Boundingbox max
        } else if (coordSystem === "LV95") {
            //LV95
            startPoint = [2450000, 1060000]; //Boundingbox min
            endPoint = [2850000, 1300000]; //Boundingbox max
        } else {
            alert("No or a not allowed \"coordinateSystem\" has been defined!");
        }

        for (let Y = startPoint[0]; Y < endPoint[0]; Y += pointGap) {
            for (let X = startPoint[1]; X < endPoint[1]; X += pointGap) {
                if (pointInPolygon([Y, X], polygon)) {
                    let coordinatesLength = feature.geometry.coordinatesBuffer[p].length;
                    if (coordinatesLength === 1) {
                        dots.push([Y, X]);
                        counter++;
                    } else {
                        let within = true;
                        for (let c = 0; c < coordinatesLength; c++) {
                            let innerPolygon = feature.geometry.coordinatesBuffer[p][c];
                            if (pointInPolygon([Y, X], innerPolygon)) {
                                within = false;
                                break;
                            }
                        }
                        if (within) {
                            dots.push([Y, X]);
                            counter++;
                        }
                    }
                }
            }
        }

    }

    return [dots, counter];
}