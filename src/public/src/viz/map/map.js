/**
 * [description]
 * @project Square and Buffer DotMaps
 * @author Adriana Zanda <adriana.zanda@fhnw.ch>
 * @date 29.06.2018
 * @version 1.0
 * @description: based on MSc Thesis Thomas Studer 2016
 * @ECMAScript6
 * version 2.0: (27.03.2020) mouseover & ontouch functions / D. Hollenstein
 */

function drawMap(data) {
    // define global variables
    let numberOfSquares = data.numberOfDetails;
    let vizWidth = data.customWidth;
    let numberOfColumns;
    let numberOfRows;
    if (numberOfSquares == 1) {
        numberOfColumns = 1;
        numberOfRows = 1;
    } else if (numberOfSquares == 2) {
        if (data.arrangement == "vertical") {
            numberOfColumns = 1;
            numberOfRows = 2;
        } else if (data.arrangement == "horizontal") {
            numberOfColumns = 2;
            numberOfRows = 1;
        } else {
            alert("Wrong \"arrangement\"! Only horizontal or vertical!");
        }
    } else {
        alert("Too many \"numberOfDetails\" defined! Maximum = 2!");
    }

    let cellWidth = vizWidth / numberOfColumns;
    let cellHeight = cellWidth / 3 * 2;
    let vizHeight;
    if (data.customHeight === "auto") {
        vizHeight = numberOfRows * cellHeight;
    } else {
        vizHeight = data.customHeight;
    }

    let polygonMap, pointMap, clonePointMap, overlayPolygonMap;
    let requestedDots = [];
    let BBMap = 0;
    let identity, path;
    let strokeWidthPolys = 1;
    let cloneSelectorList = [];

    let timestampStart, timestampStop, timeUsed;


    // start the drawing
    timestampStart = Date.now();

    // Add the svg element.
    let svg = d3.select("#vizSVG")
       // .attr("width", vizWidth)
        //.attr("height", vizHeight);

    // generate the positions of the reactangle(s) for the number of maps
    let cellPositions = publicGridCellPositions();

    //draw legend
    caption(svg, data, 0);

    // get polygons for drawing & calculation
    let urlDrawPolys; // Darstellungskantone
    let urlBufferPolys; // Berechnungskanton

    // Partly two differently generalized polygons for calculation and drawing > faster!
    if (data.polygonExtent === "NW" && data.cantonType === "canton") {
        urlBufferPolys = "./static/data/viz/kt_nw_innerBuffer_LV95.json";
        urlDrawPolys = "./static/data/viz/kt_nw_gen_LV95.json";
    } else if (data.polygonExtent === "CH" && data.cantonType === "canton") {
        urlBufferPolys = "./static/data/viz/kt_ch_innerBuffer_LV95.json";
        urlDrawPolys = "./static/data/viz/kt_ch_gen_LV95.json";
    } else if (data.polygonExtent === "CH" && data.cantonType === "tile") {
        urlBufferPolys = "./static/data/viz/tile_ch_oS_LV95.json";
        urlDrawPolys = "./static/data/viz/tile_ch_oS_LV95.json";
    } else {
        alert("No or a not allowed combination of \"polygonExtent\" and \"cantonType\" has been defined!");
    }


    //drawing mode D3
    d3.queue()
        .defer(d3.json, urlDrawPolys)
        .defer(d3.json, urlBufferPolys)
        .await(function (error, canton, bufferedCantons) {
            //backup coordinates
            let bufferedLength = bufferedCantons.features.length;
            for (let f = 0; f < bufferedLength; f++) {
                backupCoordinates(bufferedCantons.features[f]);
            }
            let cantonLength = canton.features.length;
            for (let f = 0; f < cantonLength; f++) {
                backupCoordinates(canton.features[f]);
            }

            //Bounding Box über alle Kantone > gleiche Maschenweite/gleiches Gitternetz für alle Kantone!
            BBMap = d3.geoPath().bounds(canton);

            // for each Rectangle (from TOP LEFT to BOTTOM RIGHT!)
            let numberOfCellPositions = cellPositions.length;
            for (let iRect = 0; iRect < numberOfCellPositions; iRect++) {

                cloneSelectorList = [];
                requestedDots = [];

                //Definition of necessary variables and variables derived from the canton json
                let position = cellPositions[iRect];
                if (iRect === 1 && data.arrangement === "vertical") {
                    // Karten untereinander
                    position[1] = position[1] + data.spaceBetweenMaps;
                } else if (iRect === 1 && data.arrangement === "horizontal") {
                    // Karten nebeneinander
                    position[0] = position[0] + data.spaceBetweenMaps;
                }

                // Get different dot values per category/map
                if (iRect === 0) {
                    let dataLength = data.categoryOne.length;
                    for (let row = 0; row < dataLength; row++) {
                        let cantonValue = data.categoryOne[row].value;
                        let cantonShortName = data.categoryOne[row].status;
                        let bufferedLength = bufferedCantons.features.length;
                        for (let f = 0; f < bufferedLength; f++) {
                            if (bufferedCantons.features[f].properties.name_short === cantonShortName) {
                                bufferedCantons.features[f].properties["value"] = cantonValue;
                            }
                        }
                        let cantonLength = canton.features.length;
                        for (let f = 0; f < cantonLength; f++) {
                            if (canton.features[f].properties.name_short === cantonShortName) {
                                canton.features[f].properties["value"] = cantonValue;
                            }
                        }
                        requestedDots[data.categoryOne[row].status] = data.categoryOne[row].value / data.formatValue;
                    }
                    data.categoryColor = data.categoryTypeOneColor;

                } else if (iRect === 1) {
                    let dataLength = data.categoryTwo.length;
                    for (let row = 0; row < dataLength; row++) {
                        let cantonValue = data.categoryTwo[row].value;
                        let cantonShortName = data.categoryTwo[row].status;
                        let bufferedLength = bufferedCantons.features.length;
                        for (let f = 0; f < bufferedLength; f++) {
                            if (bufferedCantons.features[f].properties.name_short === cantonShortName) {
                                bufferedCantons.features[f].properties["value"] = cantonValue;
                            }
                        }
                        let cantonLength = canton.features.length;
                        for (let f = 0; f < cantonLength; f++) {
                            if (canton.features[f].properties.name_short === cantonShortName) {
                                canton.features[f].properties["value"] = cantonValue;
                            }
                        }

                        requestedDots[data.categoryTwo[row].status] = data.categoryTwo[row].value / data.formatValue;
                    }
                    data.categoryColor = data.categoryTypeTwoColor;

                }

                // construct SVG structure
                svg.append("g")
                    .attr("id", "map_" + iRect)
                    .attr("class", "map")
                    .attr("width", cellWidth)
                    .attr("height", cellHeight);

                polygonMap = d3.select("#map_" + iRect)
                    .append("g")
                    .attr("id", "polygons_" + iRect);

                pointMap = d3.select("#map_" + iRect)
                    .append("g")
                    .attr("id", "points_" + iRect);

                clonePointMap = d3.select("#map_" + iRect)
                    .append("g")
                    .attr("id", "clonePoints_" + iRect);

                overlayPolygonMap = d3.select("#map_" + iRect)
                    .append("g")
                    .attr("id", "overlayPolygons_" + iRect);

                //draw polygons
                drawPolygons(canton, position, iRect);

                // draw dots and handle Clones
                if (data.mapDrawingMode === "square" || data.mapDrawingMode === "buffer") {

                    console.log("Map " + iRect + " - Cloned obejcts:");

                    let dotGeojson = {
                        "type": "FeatureCollection",
                        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::21781" } },
                        "features": []
                    };

                    // get dots
                    let jsonLength = bufferedCantons.features.length;
                    for (let f = 0; f < jsonLength; f++) {
                        let iteratingFeature = bufferedCantons.features[f];
                        let name_short = iteratingFeature.properties.name_short;
                        let cantonDots = getDotsPerCanton(iteratingFeature, data.borderOffset, name_short, iRect);
                        dotsToGeojson(cantonDots, name_short, dotGeojson);
                    }

                    // handle clones
                    if (cloneSelectorList.length > 2) {
                        alert("There are more than 2 clones. The System can manage only a maximum 2 clones per map!");
                    }
                    else if (cloneSelectorList.length > 0) {
                        handleClones(canton, position, iRect, bufferedCantons);
                    } else {
                        console.log("No clones!");
                    }

                    //draw dots
                    drawDots(dotGeojson, position);

                } else {
                    alert("No or a not allowed \"mapDrawingMode\" has been defined!");
                }

                // Add tooltip for TILE visualization
                //if (data.cantonType === "tile" || data.polygonExtent === "NW") {

                    drawTooltipPolygons(canton, position, iRect, bufferedCantons);
                //}


                timestampStop = Date.now();
                timeUsed = timestampStop - timestampStart;
                console.log("The calculation used:" + timeUsed + "ms!");
            }
        });


    // FUNCTIONS
    function publicGridCellPositions() {

        // We store the top left positions of the rectangles in the grid.
        // These positions will be our reference points for drawing the maps
        let cellPositions = [];
        let counter = 0;
        for (let y = 0; y < numberOfRows; y++) {
            for (let x = 0; x < numberOfColumns; x++) {
                counter += 1;
                if (counter <= numberOfSquares) {
                    if (counter === numberOfSquares && (counter % numberOfColumns) !== 0) {
                        cellPositions.push([
                            x / 2 + data.defaultCenter,
                            y * cellHeight + data.defaultCenterDelta]);
                    } else {
                        cellPositions.push([
                            x * cellWidth + data.defaultCenter,
                            y * cellHeight + data.defaultCenterDelta]);
                    }
                }
            }
        }
        return cellPositions;
    }

    function drawPolygons(geojson, transitionPos, iterator) {

        identity = d3.geoIdentity(function (x, y) {
            return [x, y];
        }).reflectY(true).fitExtent([[0, 0],
        [cellWidth - data.minimizeMapX, cellHeight - data.minimizeMapY]], geojson);

        path = d3.geoPath()
            .projection(identity);

        polygonMap.selectAll(`.origPoly`)
            .data(geojson.features) //bind these to the features array in json
            .enter()
            .append("path")
            .attr("class", "origPoly")
            .attr("id", function (d) { return d.properties.name_short + "_" + iterator })
            .attr("transform", "translate(" + transitionPos[0] + ", " + transitionPos[1] + ")")
            .attr("stroke-width", strokeWidthPolys + "px")    // same width in buffer() calculation
            .attr("stroke", "#808080")
            .attr("fill", "#E1E1E1")
            .attr("d", path);
    }

    // Tooltip function for TILE Map
    function drawTooltipPolygons(geojson, transitionPos, iterator, bufferedCantons) {

        const defaultFontH2 = data.defaultFontH2;
        const fontFamily = data.defaultFontFamily;

        let cantonsLength = geojson.features.length;
        for (let f = 0; f < cantonsLength; f++) {
            let iteratingFeature = geojson.features[f];
            iteratingFeature.properties['value'] = bufferedCantons.features[f].properties.value;

        }

        overlayPolygonMap.selectAll(`.overlayPoly`)
            .data(geojson.features) //bind these to the features array in json
            .enter()
            .append("path")
            .attr("class", "overlayPoly")
            .attr("id", function (d) { return "overlay_" + d.properties.name_short + "_" + iterator })
            .attr("value", function (d) {return d.properties.value})
            .attr("transform", "translate(" + transitionPos[0] + ", " + transitionPos[1] + ")")
            .attr("stroke-width", 1.5 * strokeWidthPolys + "px")    // same width in buffer() calculation
            .attr("stroke", "#808080")
            .attr("fill", "#F2F2F2")
            .attr("opacity", 0)
            .attr("d", path)
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8);
                d3.select(this.parentNode).append("text")
                    .attr("class", "mylabel")
                    .attr('transform', "translate(" + (path.centroid(d)[0] + transitionPos[0]) +
                        ", " + (path.centroid(d)[1] + transitionPos[1]) + ")")
                    .style('text-anchor', 'middle')
                    .attr('font-family', fontFamily)
                    .attr('font-size', defaultFontH2)
                    .attr('font-weight', "bold")
                    .text(d.properties.name_short + ': ' + d3.select(this).attr("value"));
            })

            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 0);
                d3.selectAll(".mylabel").remove();
            })

            .on("touchstart", function(d) {
                    d3.event.preventDefault();
                    var y = d3.event.touches[0].pageY;
                    var x = d3.event.touches[0].pageX;
                    var targetElement = document.elementFromPoint(x,y);
                    if (targetElement && targetElement.getAttribute("class") === "overlayPoly") {
                        touchedPoly = d3.select("#"+ targetElement.getAttribute("id")).style("opacity",0.8);
                        d3.select(this.parentNode).append("text")
                            .attr("class", "mylabel")
                            .attr('transform', "translate(" + (path.centroid(d)[0] + transitionPos[0]) +
                                ", " + (path.centroid(d)[1] + transitionPos[1]) + ")")
                            .style('text-anchor', 'middle')
                            .attr('font-family', fontFamily)
                            .attr('font-size', defaultFontH2)
                            .attr('font-weight', "bold")
                            .text(d.properties.name_short + ': ' + d3.select(this).attr("value"));
                        }
			        })


           .on("touchend", function(){
                touchedPoly.style("opacity",0);
                d3.selectAll(".mylabel").remove();
           });

    }

    function getDotsPerCanton(iteratingFeature, offset, name_short, iterator) {
        let dots;

        if (data.mapDrawingMode === "buffer") {

            dots = getRightNumberOfDotsBuffer(
                iteratingFeature, strokeWidthPolys, offset,
                cellWidth, cellHeight, BBMap,
                data.coordinateSystem, data.paddingC,
                requestedDots[name_short], name_short, iterator,
                cloneSelectorList
            );

        } else if (data.mapDrawingMode === "square") {

            //add Buffered Polygon Coordinates
            getFirstSquarishAttributes(
                iteratingFeature, strokeWidthPolys, offset,
                cellWidth, cellHeight, BBMap,
                requestedDots[name_short], data.formatValue, iterator,
                cloneSelectorList
            );

            if (iteratingFeature.geometry.coordinatesBuffer.length > 0 &&
                Math.round(requestedDots[name_short]) > 0) {
                iteratingFeature.properties.gridSize = data.paddingC;
                let featureGridded = setGrid(iteratingFeature);                                   // Erstellt ein Grid mit kleinster Maschenweite und dessen Knoten in der Fläche sind
                let pointFeature = setPoints(featureGridded, iterator, cloneSelectorList);                            // Selektiert die Grid-Koordinaten bei welchen ein Punkt dargestellt wird
                dots = constructDotKooArray(pointFeature);
            } else {
                dots = [];
            }

        }
        return dots;
    }

    function dotsToGeojson(dots, name_short, geojson) {
        let dotsLength = dots.length;
        for (let d = 0; d < dotsLength; d++) {
            let dotFeature = {};
            dotFeature['type'] = 'Feature';
            dotFeature['properties'] = {
                'ID': name_short + "_" + d, 'class': name_short, 'name_short': name_short,
                'symbolShape': data.symbolShape, 'symbolType': data.symbolType
            };
            dotFeature['geometry'] = { 'type': 'Point', 'coordinates': dots[d] };

            geojson['features'].push(dotFeature);
        }

    }

    function drawDots(dotGeojson, transitionPos) {
        pointMap.selectAll(`.sym`)
            .data(dotGeojson.features) //bind these to the features array in json
            .enter()
            .append("path")
            .attr('class', "sym sym-" + data.categoryColor)
            .attr("id", (d) => { return pointMap.attr("id") + "-" + d.properties.class})
            .attr("transform", "translate(" + transitionPos[0] + ", " + transitionPos[1] + ")")
            .attr("d", path.pointRadius(1.5));

        let pointPaths = pointMap.selectAll(`.sym`);

        let nodes = pointPaths.nodes();
        let nodePositions = [];

        for (let iterator = 0; iterator < nodes.length; iterator++) {
            let node = nodes[iterator];
            let pos = node.getPointAtLength(0);
            nodePositions.push(pos);
        }

        pointMap.selectAll(`.sym`)
            .attr("d", function (d) {
                return symbol[d.properties.symbolShape][d.properties.symbolType]
            })
            .attr("transform", function (d, i) {
                return "translate(" + (nodePositions[i]["x"] + transitionPos[0]) + ", " + (nodePositions[i]["y"] + transitionPos[1]) + ")"
            });


    }



    function handleClones(unbufferedCantons, transitionPos, iterator, bufferedCantons) {
        let clonedGeojson = {
            "type": "FeatureCollection",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::21781" } },
            "features": []
        };

        console.log("");
        console.log("Clones which are still too small:");

        // create Geojson with unbuffered cantons which need to be cloned
        let cloneSelectorListLength = cloneSelectorList.length;
        for (let e = 0; e < cloneSelectorListLength; e++) {
            let tempCloneId = cloneSelectorList[e][1];

            let jsonLength = unbufferedCantons.features.length;
            for (let f = 0; f < jsonLength; f++) {

                let iteratingFeature = unbufferedCantons.features[f];
                let featName = iteratingFeature.properties.name_short;
                if (featName === tempCloneId) {
                    clonedGeojson['features'].push(iteratingFeature);
                    break;
                }
            }
        }

        let transformScale_0;
        let transitionX_0;
        let transitionY_0;

        if (iterator === 0) {
            transformScale_0 = data.categoryOne_clone0_transScale;
            transitionX_0 = transitionPos[0] + data.categoryOne_clone0_transX;
            transitionY_0 = transitionPos[1] + data.categoryOne_clone0_transY;
        } else if (iterator === 1) {
            transformScale_0 = data.categoryTwo_clone0_transScale;
            transitionX_0 = transitionPos[0] + data.categoryTwo_clone0_transX;
            transitionY_0 = transitionPos[1] + data.categoryTwo_clone0_transY;
        }

        // create object with a clone's specific attributes and add them to an array
        let clone0 = {
            shortname: cloneSelectorList[0][1],
            polyClass: cloneSelectorList[0][0],
            pointClass: ".clone0",
            transformScale: transformScale_0,
            transitionX: transitionX_0,
            transitionY: transitionY_0
        };
        let clonesList = [clone0];

        //for 2 clones
        if (cloneSelectorList.length > 1) {

            let transformScale_1;
            let transitionX_1;
            let transitionY_1;

            //for map 0
            if (iterator === 0) {
                transformScale_1 = data.categoryOne_clone1_transScale;
                transitionX_1 = transitionPos[0] + data.categoryOne_clone1_transX;
                transitionY_1 = transitionPos[1] + data.categoryOne_clone1_transY;
            } else if (iterator === 1) {
                //for map 1
                transformScale_1 = data.categoryTwo_clone1_transScale;
                transitionX_1 = transitionPos[0] + data.categoryTwo_clone1_transX;
                transitionY_1 = transitionPos[1] + data.categoryTwo_clone1_transY;
            }

            let clone1 = {
                shortname: cloneSelectorList[1][1],
                polyClass: cloneSelectorList[1][0],
                pointClass: ".clone1",
                transformScale: transformScale_1,
                transitionX: transitionX_1,
                transitionY: transitionY_1
            };
            clonesList.push(clone1);
        }


        // draw connecting lines between orig and clone canton
        for (let element = 0; element < cloneSelectorListLength; element++) {
            let state = d3.selectAll(".origPoly").filter(clonesList[element].polyClass);
            let centroid = path.centroid(state.datum());

            polygonMap.append("line")
                .attr("x1", centroid[0] + transitionPos[0])
                .attr("y1", centroid[1] + transitionPos[1])
                .attr("x2", centroid[0] + clonesList[element].transitionX)
                .attr("y2", centroid[1] + clonesList[element].transitionY)
                .attr("stroke-width", 1.5)
                .attr("stroke", "#808080");
        }


        // scale clones with individual offsets
        scale(clonedGeojson.features[0], clonesList[0].transformScale);
        if (cloneSelectorList.length > 1) {
            scale(clonedGeojson.features[1], clonesList[1].transformScale);
        }

        // draw Clone polygons and move them
        polygonMap.selectAll(`.clonedPoly`)
            .data(clonedGeojson.features) //bind these to the features array in json
            .enter()
            .append("path")
            .attr("class", "clonedPoly")
            .attr("id", function (d) { return d.properties.name_short + "_" + iterator })
            .attr("transform", "translate(" + transitionPos[0] + ", " + transitionPos[1] + ")")
            .attr("stroke-width", "1px")
            .attr("stroke", "#808080")
            .attr("fill", "#E1E1E1")
            .attr("d", path);

        d3.selectAll(".clonedPoly").filter(clonesList[0].polyClass)
            .attr("transform", "translate(" + clonesList[0].transitionX + ", " + clonesList[0].transitionY + ")");

        //redesign the cloned original objects (lighter grey)
        d3.selectAll(".origPoly").filter(clonesList[0].polyClass)
            .attr("stroke-width", "1px")
            .attr("stroke", "#9B9B9B")
            .attr("fill", "#F2F2F2");


        if (cloneSelectorList.length > 1) {
            d3.selectAll(".clonedPoly").filter(clonesList[1].polyClass)
                .attr("transform", "translate(" + clonesList[1].transitionX + ", " + clonesList[1].transitionY + ")");

            d3.selectAll(".origPoly").filter(clonesList[1].polyClass)
                .attr("stroke-width", "1px")
                .attr("stroke", "#9B9B9B")
                .attr("fill", "#F2F2F2");
        }



        // calculate and draw dots of cloned objects
        for (let feat = 0; feat < clonedGeojson.features.length; feat++) {

            let clonedDotsGeojson = {
                "type": "FeatureCollection",
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::21781" } },
                "features": []
            };

            let clonedFeature = clonedGeojson.features[feat];
            let shortname = clonedFeature.properties.name_short;
            backupOrigCoordinates(clonedFeature);
            let cloneDots = getDotsPerCanton(clonedFeature, data.borderOffset, shortname, iterator);

            dotsToGeojson(cloneDots, shortname, clonedDotsGeojson);

            clonePointMap.selectAll(".clone" + feat)
                .data(clonedDotsGeojson.features) //bind these to the features array in json
                .enter()
                .append("path")
                .attr('class', "clonePoint clone" + feat + " sym sym-" + data.categoryColor)
                .attr("transform", "translate(" + transitionPos[0] + ", " + transitionPos[1] + ")")
                .attr("d", path.pointRadius(1.5));
        }

        if (clonesList.length === 1) {
            if (cloneSelectorList.length === 2) {
                alert("Clone of canton " + cloneSelectorList[1][1] + " is still too small!");
            } else {
                console.log("No clones are too small any more!");
            }
        } else if (clonesList.length === 2) {
            if (cloneSelectorList.length === 3) {
                alert("Clone of canton " + cloneSelectorList[2][1] + " is still too small!");
            } else if (cloneSelectorList.length === 4) {
                alert("Clone of cantons " + cloneSelectorList[2][1] + " and " + cloneSelectorList[3][1] + " are still too small!");
            } else {
                console.log("No clones are too small any more!");
            }
        }

        // move dots to the same place as the cloned polygons
        for (let cloneId = 0; cloneId < clonesList.length; cloneId++) {
            let temp = clonesList[cloneId].pointClass;
            let clonedPointPaths = clonePointMap.selectAll(temp);

            let clonedNodes = clonedPointPaths.nodes();
            let clonedNodePositions = [];

            for (let iterator = 0; iterator < clonedNodes.length; iterator++) {
                let clonedNode = clonedNodes[iterator];
                let clonedPos = clonedNode.getPointAtLength(0);
                clonedNodePositions.push(clonedPos);
            }

            clonePointMap.selectAll(temp)
                .attr("d", function (d) {
                    return symbol[d.properties.symbolShape][d.properties.symbolType]
                })
                .attr("transform", function (d, i) {
                    return "translate(" + (clonedNodePositions[i]["x"] + clonesList[cloneId].transitionX) + ", "
                        + (clonedNodePositions[i]["y"] + clonesList[cloneId].transitionY) + ")"
                });
        }

        // handle tooltip in Tile Map for cloned polygons
        //if (data.cantonType === "tile" || data.polygonExtent === "NW") {
            const defaultFontH2 = data.defaultFontH2;
            const fontFamily = data.defaultFontFamily;

            overlayPolygonMap.selectAll(`.clonedOverlayPoly`)
                .data(clonedGeojson.features) //bind these to the features array in json
                .enter()
                .append("path")
                .attr("class", "clonedOverlayPoly")
                .attr("id", function (d) { return d.properties.name_short + "_" + iterator })
                .attr("value", function (d) { return d.properties.value})
                .attr("transform", "translate(" + transitionPos[0] + ", " + transitionPos[1] + ")")
                .attr("stroke-width", 1.5 * strokeWidthPolys + "px")    // same width in buffer() calculation
                .attr("stroke", "#808080")
                .attr("fill", "#F2F2F2")
                .attr("opacity", 0)
                .attr("d", path)
                .on("mouseout", function (d) {
                    d3.select(this).style("opacity", 0);
                    d3.selectAll(".mylabel").remove();
                })

                .on("touchend", function(){
                    d3.select(this).style("opacity",0);
                    d3.selectAll(".mylabel").remove();
                });

            d3.selectAll(".clonedOverlayPoly").filter(clonesList[0].polyClass)
                .attr("transform", "translate(" + clonesList[0].transitionX + ", " + clonesList[0].transitionY + ")")
                .on("mouseover", function (d) {
                    d3.select(this).style("opacity", 0.8);
                    d3.select(this.parentNode).append("text")
                        .attr("class", "mylabel")
                        .attr('transform', "translate(" + (path.centroid(d)[0] + clonesList[0].transitionX) +
                            ", " + (path.centroid(d)[1] + clonesList[0].transitionY) + ")")
                        .style('text-anchor', 'middle')
                        .attr('font-family', fontFamily)
                        .attr('font-size', defaultFontH2)
                        .attr('font-weight', "bold")
                        .text(d.properties.name_short + ': ' + d3.select(this).attr("value"));
                })

                .on("touchstart", function(d) {
                    d3.event.preventDefault();
                    d3.select(this).style("opacity", 0.8);
                    d3.select(this.parentNode).append("text")
                        .attr("class", "mylabel")
                        .attr('transform', "translate(" + (path.centroid(d)[0] + clonesList[0].transitionX) +
                            ", " + (path.centroid(d)[1] + clonesList[0].transitionY) + ")")
                        .style('text-anchor', 'middle')
                        .attr('font-family', fontFamily)
                        .attr('font-size', defaultFontH2)
                        .attr('font-weight', "bold")
                        .text(d.properties.name_short + ': ' + d3.select(this).attr("value"));
			    });



            if (clonesList.length > 1) {
                d3.selectAll(".clonedOverlayPoly").filter(clonesList[1].polyClass)
                    .attr("transform", "translate(" + clonesList[1].transitionX + ", " + clonesList[1].transitionY + ")")
                    .on("mouseover", function (d) {
                        d3.select(this).style("opacity", 0.8);
                        d3.select(this.parentNode).append("text")
                            .attr("class", "mylabel")
                            .attr('transform', "translate(" + (path.centroid(d)[0] + clonesList[1].transitionX) +
                                ", " + (path.centroid(d)[1] + clonesList[1].transitionY) + ")")
                            .style('text-anchor', 'middle')
                            .attr('font-family', fontFamily)
                            .attr('font-size', defaultFontH2)
                            .attr('font-weight', "bold")
                            .text(d.properties.name_short);
                    })
                    .on("touchstart", function(d) {
                    d3.event.preventDefault();
                    d3.select(this).style("opacity", 0.8);
                    d3.select(this.parentNode).append("text")
                        .attr("class", "mylabel")
                        .attr('transform', "translate(" + (path.centroid(d)[0] + clonesList[0].transitionX) +
                            ", " + (path.centroid(d)[1] + clonesList[0].transitionY) + ")")
                        .style('text-anchor', 'middle')
                        .attr('font-family', fontFamily)
                        .attr('font-size', defaultFontH2)
                        .attr('font-weight', "bold")
                        .text(d.properties.name_short + ': ' + d3.select(this).attr("value"));
			    });
            //}
        }

        // Reassign original coordinates (for the case that a canton is a clone in two maps)
        let numberOfClones = clonedGeojson.features.length;
        for (let i = 0; i < numberOfClones; i++) {
            reassignOrigCoords(clonedGeojson.features[i]);
        }


    }

}