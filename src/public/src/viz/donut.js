/*
	A. Allenspach / P. Meyer / D. Hollenstein
	donut.js

	1.00 (11.10.2017) Initial
	1.01 (20.10.2017) convert to function
	2.00 (27.03.2020) mouseover & ontouch functions
*/


function drawDonut(data) {

    let marginSVG = {
        top: data.margin[0].top,
        right: data.margin[0].left,
        bottom: data.margin[0].bottom,
        left: data.margin[0].left
    };

    let widthSVG = data.customWidth - marginSVG.left - marginSVG.right;
    let heightSVG = data.customHeight - marginSVG.top - marginSVG.bottom;
    let fontFamily = data.defaultFontFamily;
    let defaultFontH2 = data.defaultFontH2;

    let svg = d3.select("#vizSVG")
        .attr("width", widthSVG + marginSVG.left + marginSVG.right)
        .attr("height", heightSVG + marginSVG.top + marginSVG.bottom)
        .append("g").attr("id", "vizGroup");

    let category = data.categoryOne[0].valueDetails;
    let numberOfDetails = data.categoryOne[0].valueDetails.length;

    let numberOfRings = 1;
    if (typeof data.numberOfRings !== 'undefined') {
        numberOfRings = data.numberOfRings;
    }

    draw(svg, data);
    caption(svg, data, numberOfDetails, defaultFontH2, fontFamily);




    function draw(svg, data) {

        let count = 0;
        let rings = [];

        for (let i = 0; i < numberOfRings; i++) {
            rings[i] = {};
            rings[i].numberOfSymbols = parseInt(deg2rad(data.openingAngle) * (data.outerRadius - i * data.gapBetweenSymbols) / data.gapBetweenSymbols);
            rings[i].angleBetweenSymbols = deg2rad(data.openingAngle) / rings[i].numberOfSymbols;
            rings[i].dAlpha = 0;
            count += rings[i].numberOfSymbols;
        }

        count += (data.openingAngle === 360) ? 0 : numberOfRings;

        let sumValue = getSumValue();

        let sumValuePerPoint = sumValue / count;

        if (data.comma == "TRUE") {
            data.formatValue = sumValuePerPoint.toFixed([1]);
        } else {
            data.formatValue = Math.round(sumValuePerPoint);
        }


        let donutViz = svg.append("g").attr("id", "donut")
            .attr('transform', `rotate(${data.startAngle - 90},${data.centerX},${data.centerY})`);

        if (typeof category !== 'undefined' && typeof category[0].value !== 'undefined'
            && typeof category[0].color !== 'undefined') {
            let cat = 0;
            let val = 0;
            let color = category[cat].color;
            let tempValue = category[cat].value;
            let leastDelta = leastDeltaAlpha(rings);
            let symClass;
            let i = 1;
            let j = 0;
            let valueData = category[0].value;
            const roundingProblem = (data.openingAngle === 360) ? -1 : 1;
            while (leastDelta <= deg2rad(data.openingAngle) + (0.00000000000001 * roundingProblem)) {
                let index = leastIndex(rings);
                let radiusTemp = data.outerRadius - index * data.gapBetweenSymbols;
                let x = data.centerX + radiusTemp * Math.cos(rings[index].dAlpha);
                let y = data.centerY + radiusTemp * Math.sin(rings[index].dAlpha);
                rings[index].dAlpha = rings[index].dAlpha + rings[index].angleBetweenSymbols;
                while (i * sumValuePerPoint > tempValue) {
                    cat = cat + 1;
                    tempValue = tempValue + category[cat].value;
                    color = category[cat].color;
                    valueData = category[cat].value;
                }
                const pentagonAngle = (data.symbolShape === 'pentagon') ? 90 : 0;

                if (data.symbolType === '4') {
                    symClass = color;

                } else {symClass = "sym sym-" + color}

                donutViz.append("path")
                    .attr('class', symClass)
                    .attr('id', symClass)
                    .attr('d', symbol[data.symbolShape][data.symbolType])
                    .attr("transform", "rotate(" + (rad2deg(leastDelta) + pentagonAngle) + "," + x + "," + y + ") translate(" + x + "," + y + ")")
                    .attr('value', valueData)
                    .on("mouseover", function (d) {
                        let textValue = d3.select(this).attr("value");
                        let categoryOpacity = d3.select(this).attr("class");
                        replaced = categoryOpacity.split(' ').join('.');
                        d3.selectAll("." + replaced).style("opacity", 0.3);
                        tooltip.style("visibility", "visible").text(textValue)
                            .style("top", (d3.event.pageY - 20) + "px")
                            .style("left", (d3.event.pageX + 20) + "px");
                    })

                    .on("mouseout", function () {
                        let tester = d3.select(this).attr("class");
                        replaced = tester.split(' ').join('.');
                        d3.selectAll("." + replaced).style("opacity", 1);
                        tooltip.style("visibility", "hidden");
                    })

                    .on("touchstart", function(){
                        var y = d3.event.touches[0].pageY;
                        var x = d3.event.touches[0].pageX;
                        var targetElement = document.elementFromPoint(x,y);
                        if (targetElement && targetElement.nodeName === "path") {
                            touchedPoints = d3.selectAll("#"+targetElement.getAttribute("id")).style("opacity",0.5);
                            //d3.selectAll("#"+groupID).exit();
                            tooltip.style("visibility", "visible")
                                .style("top", (d3.event.touches[0].pageY - 70) + "px")
                                .style("left", (d3.event.touches[0].pageX - 70) + "px")
                                .text(targetElement.getAttribute("value"));
                         }
			        })

                    .on("touchmove", function(){
                        touchedPoints.style("opacity",1);
                        tooltip.style("visibility", "hidden").text("");
                        var y = d3.event.touches[0].pageY;
                        var x = d3.event.touches[0].pageX;
                        var targetElement = document.elementFromPoint(x,y);
                        if (targetElement && targetElement.nodeName === "path") {
                            touchedPoints = d3.selectAll("#"+targetElement.getAttribute("id")).style("opacity",0.5);
                            tooltip.style("visibility", "visible")
                                .style("top", (d3.event.touches[0].pageY - 70) + "px")
                                .style("left", (d3.event.touches[0].pageX - 70) + "px")
                                .text(targetElement.getAttribute("value"));
                        }
			    })

                   .on("touchend", function(){
                        touchedPoints.style("opacity",1);
                        tooltip.style("visibility", "hidden").text("");
                    });


                leastDelta = leastDeltaAlpha(rings);
                i = i + 1;
            }
        }

        const tooltip = d3.select('body')
            .append("div")
            .attr("id", "mytooltip")
            .style("position", "absolute")
            .style("z-index", "100000")
            .style("background", "#f3f3f3")
            .style("padding", "3px")
            .style("border-radius", "8px")
            .style("visibility", "hidden")
            .attr('font-family', data.defaultFontFamily)
            .attr('font-size', data.defaultFontH2)
            .attr('font-weight', "bold")
            .style('text-anchor', 'left')

    }

    function getSumValue() {
        let sumValue = 0;
        if (typeof category !== 'undefined') {
            for (let i = 0; typeof category[i] !== 'undefined' && typeof category[i].value !== 'undefined'; i++) {
                sumValue = sumValue + category[i].value;
            }
        }
        return sumValue;
    }

    function leastDeltaAlpha(rings) {
        let ringDAlpha = 4 * Math.PI;
        //let index = 0;
        for (let i = 0; i < numberOfRings; i++) {
            if (rings[i].dAlpha < ringDAlpha) {
                ringDAlpha = rings[i].dAlpha;
                //index = i;
            }
        }
        return ringDAlpha;
    }

    function leastIndex(rings) {
        let ringDAlpha = 4 * Math.PI;
        let index = 0;
        for (let i = 0; i < numberOfRings; i++) {
            if (rings[i].dAlpha < ringDAlpha) {
                ringDAlpha = rings[i].dAlpha;
                index = i;
            }
        }
        return index;
    }
}

