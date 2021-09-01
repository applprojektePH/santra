/*
	D. Hollenstein
	bar.js

	1.00 (07.09.2020) Initial, based on pyramid.js by A.Allenspach / P. Meyer
 */

function drawBar(data) {

	let defaultCenterDelta = 0;
	if (typeof data.defaultCenterDelta !== 'undefined') {
		defaultCenterDelta = data.defaultCenterDelta;
	}

	let numberOfDetails = 1;
	if (typeof data.numberOfDetails !== 'undefined') {
		numberOfDetails = data.numberOfDetails;
	}

	let SVGmargin = {	top: data.margin[0].top,
		right: data.margin[0].left,
		bottom: data.margin[0].bottom,
		left: data.margin[0].left};
	let SVGwidth = data.customWidth - SVGmargin.left - SVGmargin.right;
	let SVGheight = data.customHeight - SVGmargin.top - SVGmargin.bottom;
	let fontFamily = data.defaultFontFamily;
	let defaultFontH2 = data.defaultFontH2;


	let svg = d3.select("#vizSVG")
	//.style("width", SVGwidth + SVGmargin.left + SVGmargin.right +'px')
	//.style("height", SVGheight + SVGmargin.top + SVGmargin.bottom +'px')
		.append("g");

	let viz = svg.append("g");

	if (typeof data.categoryOne !== "undefined") {
		drawSymbols(1, data.categoryTypeOneColor,data.categoryOne,data.categoryTwo,viz,data);
	}

	if (typeof data.categoryTwo !== "undefined") {
		drawSymbols(2, data.categoryTypeTwoColor,data.categoryTwo,data.categoryOne,viz,data);
	}


	caption(svg, data, numberOfDetails, defaultFontH2, fontFamily);

    function writeCategories(svg, dataCategory, data) {
		let rotate = 0;
		let pointX = 0;
		let pointY = 0;

		if (typeof data.categoryStatusRotation !== 'undefined') {
			rotate = data.categoryStatusRotation;
		}

		dataCategory.forEach(function(d) {

            let center = parseFloat(d.id)+parseFloat(0.5);
            let deltaTextAnchor = 0;
            let deltaTextAnchor2 = 0;

            if (typeof data.deltaTextAnchor !== 'undefined') {
                deltaTextAnchor = data.deltaTextAnchor;
            }
            if (typeof data.deltaTextAnchor2 !== 'undefined') {
                deltaTextAnchor2 = data.deltaTextAnchor2;
            }
            let tempNumberOfDetails = 1;
            if (typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'parallel') {
                tempNumberOfDetails = numberOfDetails;
            }
            let dCorr = 0;
            if (data.textAnchorDesc === 'middle' && data.chartDirection === "X") {
                dCorr = data.symbolWidth/2 * tempNumberOfDetails + + data.paddingLineSpaces/2 * (tempNumberOfDetails-1);
            } else if (data.textAnchorDesc === 'end' && data.chartDirection === "X") {
                dCorr = data.symbolWidth * tempNumberOfDetails + data.paddingLineSpaces * (tempNumberOfDetails-1);

            } else if (data.textAnchorDesc === 'middle' && data.chartDirection === "Y") {
                dCorr = data.defaultTextLength/2;
            } else if (data.textAnchorDesc === 'end' && data.chartDirection === "Y") {
                dCorr = data.defaultTextLength;
            }

            if (data.chartDirection === "Y") {
                pointX = data.defaultCenter + deltaTextAnchor2 +dCorr;
                pointY = deltaTextAnchor + defaultFontH2 + data.defaultCenterDelta +
                 + d.id * (data.paddingColumnSpaces + data.symbolWidth*tempNumberOfDetails +data.paddingLineSpaces*tempNumberOfDetails);
            }
            if (data.chartDirection === "X") {
                 pointX = defaultCenterDelta + deltaTextAnchor + dCorr +
                 + d.id * (data.paddingColumnSpaces + data.symbolWidth*tempNumberOfDetails +data.paddingLineSpaces*tempNumberOfDetails);
                pointY = data.defaultCenter+deltaTextAnchor2;
            }
            let wrapData = 9999;
            if (typeof data.wrapText !== 'undefined') {
                wrapData = data.wrapText;

				svg.append('text').text(d.status)
					.attr("dx",0)
					.attr("x",pointX)
					.attr("dy",0)
					.attr("y", pointY)
					.attr('font-family', fontFamily)
					.attr('font-size', defaultFontH2)
					.attr('transform','rotate('+rotate+','+pointX+','+pointY+')')
					.style("text-anchor", data.textAnchorDesc)
					.style("alignment-baseline",data.alignmentBaselineDesc)
					.call(wrap,wrapData);
			}
		});
	}


	function categoryResults(svg, data, dataColor, dataCategory, otherDataCategory) {

		writeCategories(svg, dataCategory, data);

		let results = [];
		let k = 0;
		for (let i = 0; i < dataCategory.length; i++) {

			let type = '';
			let categoryValue = 0;
			let detailId;
			let ii = 0;
			let value;
			let color = '';
			let catTotal=0;

			if (typeof dataCategory[i].value !== "undefined") {
                detailId = dataCategory[i].id;
                value = dataCategory[i].value;
                catTotal = dataCategory[i].value;

                if (typeof dataColor !== "undefined") {
                    color = dataColor;
				}
				else {
					if (typeof dataCategory[i].color !== "undefined") {
						color = dataCategory[i].color;
					}
			    }
            }
            else {
				for (let l = 0; l < dataCategory[i].valueDetails.length; l++) {
					catTotal = catTotal + dataCategory[i].valueDetails[l].value;
				}
			}

			for (let j = 1; j <= numberOfDetails; j++) {
				if (typeof data.chartTypeDetail !== 'undefined' && (data.chartTypeDetail === 'parallel' || data.chartTypeDetail === 'stacked')) {
                    type = dataCategory[i].valueDetails[j-1].type;
                    detailId = dataCategory[i].valueDetails[j-1].id;
                    value = dataCategory[i].valueDetails[j-1].value;
                    color = dataCategory[i].valueDetails[j-1].color || data.categoryTypeTwoColor;
                    ii = dataCategory[i].id;

					if (data.chartTypeDetail === 'parallel') {
					    catTotal = dataCategory[i].valueDetails[j-1].value;

				    }
                }

				results[k] = {};
				results[k].status=dataCategory[i].status.replace(/[^a-zA-Z0-9]/g,"-");
				results[k].categoryId = dataCategory[i].id;
				results[k].categoryValue = ii;
				results[k].detailId = detailId;
				results[k].color = color;
				results[k].symbolType = data.symbolType;
				results[k].value = value;
				results[k].catTotal = catTotal;
				k++;
			}
		}
		return results;
	}


	function calcObjectOne(count, categoryId, categoryValue, detailId, data) {
		let cx = 0;
		let cy = 0;

		if (data.chartDirection === "Y") {
			    cx = data.defaultCenter + data.defaultTextLength + data.paddingC;

			if(typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'stacked') {
                cy = data.defaultCenterDelta +
			    + categoryValue * (data.paddingColumnSpaces + data.symbolWidth*data.objectsColumnsPerCategory
			    + (data.objectsColumnsPerCategory-1)*data.paddingLineSpaces);

            } else {
                cy = data.defaultCenterDelta +
			    + categoryValue * (data.paddingColumnSpaces + data.symbolWidth*data.objectsColumnsPerCategory
			    + (data.objectsColumnsPerCategory)*data.paddingLineSpaces)
			    + detailId*data.paddingLineSpaces + detailId*data.symbolWidth;
            }

		} else {

		    if(typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'stacked') {
		        cx = defaultCenterDelta
			    + categoryValue * (data.paddingColumnSpaces + data.symbolWidth*data.objectsColumnsPerCategory
			    + (data.objectsColumnsPerCategory-1)*data.paddingLineSpaces)
		    }
		    else {
		        cx = defaultCenterDelta
			    + categoryValue * (data.paddingColumnSpaces + data.symbolWidth*data.objectsColumnsPerCategory
			    + (data.objectsColumnsPerCategory)*data.paddingLineSpaces)
			    + detailId*data.paddingLineSpaces + detailId*data.symbolWidth;
		    }
                cy = data.defaultCenter - data.paddingC - data.defaultTextLength;

        }

		return [cx, cy];

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
		.style("visibility", "hidden");



	function drawSymbols(count, categoryColor,category, otherCategory, svg,data){
        let results = categoryResults(svg, data, categoryColor, category, otherCategory);

        results.forEach(function(res) {
            let [x,y] = calcObjectOne(count, res.categoryId, res.categoryValue, res.detailId, data);
            res["x"]=x;
            res["y"]=y;
        })
        let rangeTop = 0;
        if (data.chartDirection === 'Y') {
            rangeTop = SVGwidth- data.defaultCenter - data.paddingC - data.paddingT - data.defaultTextLength
        } else {
            rangeTop = data.defaultCenter - data.paddingC - data.paddingT - data.defaultTextLength
        }
        var yScale = d3.scaleLinear()
            .range([0, rangeTop])

        var yMax = d3.max(results, function(d) { return d.catTotal; });
        yMax = Math.round(yMax/data.formatValue)*data.formatValue;
        yScale.domain([0, yMax]);

        svg.append("g").attr("class", "vizGroup").attr("id", "barChart")

        ////////////////////////////////////////////
        if (data.displayAxis === "True") {
            //Varianten: mit/ohne Axis, Axis mit/ohne tickLines
            var tickValues = []
            if (data.tickValues.length > 0) {
                tickValues = data.tickValues
            } else {
                for (let i = 1; i <= (yMax/data.formatValue); i++){tickValues.push(i*data.formatValue)}
                var formatValue = d3.format(data.tickFormat);
            }

            if (data.chartDirection === 'X'){
                bScale = d3.scaleLinear()
                    .range([(data.paddingT), (data.defaultCenter - data.paddingC - data.defaultTextLength)])
                    .domain([yMax, 0]);
                var yAxis = d3.axisLeft(bScale)
                    .tickValues(tickValues)
                    .tickSize(0,0)
                    .tickFormat(function(d){ return formatValue(d).split(',').join("'"); });
            }

            else {
                bScale = yScale;
                var yAxis = d3.axisBottom(bScale)
                    .tickSize((0, 0))
                    .tickValues(tickValues)
                    .tickFormat(function(d){return formatValue(d).split(',').join("'"); });
            }

            var axis = d3.select('.vizGroup').append("g").attr('class', 'axis')
                .attr('transform', function() {if (data.chartDirection === 'Y') {
                    return 'translate('+ (data.defaultCenter + data.defaultTextLength + data.paddingC) +',' + (data.defaultCenterDelta - data.paddingAxis) + ')'
                    } else {
                        return 'translate('+ (data.defaultCenterDelta - data.paddingAxis - (formatValue(yMax).split(',').join("")).length*defaultFontH2*0.5) +',0)'
                    }
                })
                .call(yAxis);

            axis.selectAll('.tick line')
                .attr('x1', function(d){ if (data.chartDirection === 'X'){
                    return ((formatValue(yMax).split(',').join("")).length-(formatValue(d).split(',').join("")).length)*defaultFontH2*0.5}
                    else {return 0}
                })

                .attr('x2', function(d) { if (data.chartDirection === 'X') {
                    if (typeof data.tickLine != undefined  && data.tickLine === 'True') {
                        return results[results.length-1].x - data.defaultCenterDelta + Number(data.symbolWidth) +
                        2*data.paddingAxis + (formatValue(yMax).split(',').join("")).length*defaultFontH2*0.5}
                    else {return (formatValue(yMax).split(',').join("")).length*defaultFontH2*0.48 + 6 }}
                    else {return 0}})

                /////////////////////////////////////////////////////////////////////
                .attr('y1', function(d) {if (data.chartDirection === 'Y') {
                    return  - (defaultFontH2*0.75-2)
                    }})

                .attr('y2', function(d) {if (data.chartDirection === 'Y') {
                    if (typeof data.tickLine != undefined  && data.tickLine === 'True') {
                        return  results[results.length-1].y + 2*data.paddingAxis
                    } else {return 6}}
                })

                .style('stroke-width', 0.3).style('stroke',  function(d) {
                    if (typeof data.tickLine != undefined  && data.tickLine === 'True') {
                        return 'black' //'#cccccc'
                    } else{return '#fffffff'}
                });
            axis.select('.domain').remove();
            axis.selectAll('.tick text')
                .attr('dx', function(d) {if (data.chartDirection === 'X') {
                   return ((formatValue(yMax).split(',').join("")).length)*defaultFontH2*0.48
                   } else {return 3}})
                .attr('dy', -defaultFontH2*0.75*0.3)
                .attr('font-family', fontFamily)
                .attr('text-anchor', function(d) {if (data.chartDirection === 'Y') {return 'start'}})
                .attr('font-size', defaultFontH2*0.75);
        }
        /////////////////////////////////////////////////////

		//var bar = svg.append("g").attr("class", "vizGroup").attr("id", "barChart")
		bar = svg.select('.vizGroup')
			.selectAll(".sym")
			.data(results)
			.enter()
			.append("g")
			.attr('class', (d) => {if (data.symbolType === '1') {return "sym-"  + d.color} else {return d.color};})
			.attr("transform", function(d) {
				var delta = 0;
				if (typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'stacked' &&d.detailId > 0){
				    var catObjects = results.filter(obj => { return obj.categoryId === d.categoryId})
				    for (let i = 1; i <= d.detailId; i++)
				        {delta = delta + catObjects[d.detailId-i].value}
				}
				if (data.chartDirection === 'Y') {return "translate("+ (results[0].x + yScale(delta)) + "," + d.y +")"}
				    else {return "translate("+ d.x + "," + (results[0].y-yScale(d.value)-yScale(delta)) +")"}
            })

            .on("mouseover", function(d) {
                hoveredBar = d3.select(this).style("opacity",0.5);
                tooltip.style("visibility", "visible")
                    .style("top", (d3.event.pageY - 20) + "px")
                    .style("left", (d3.event.pageX + 20) + "px")
                    .text(d.value);
            })

            .on("mouseout", function(){
                hoveredBar.style("opacity",1);
                tooltip.style("visibility", "hidden").text("");
            });


        bar.append('rect')
            .attr('width', function(d) {if (data.chartDirection === 'Y') {return yScale(d.value)-1;} else {return data.symbolWidth}})
            .attr('height', function(d) {if (data.chartDirection === 'Y') {return data.symbolWidth} else {return yScale(d.value)-1;}})
            //.attr('width', function(d) {if (data.chartDirection === 'Y') {if (data.symbolType === '2') {return yScale(d.value)-5} else {return yScale(d.value)-1}} else {return data.symbolWidth}})
            //.attr('height', function(d) {if (data.chartDirection === 'Y') {return data.symbolWidth} else {if (data.symbolType === '2') {return yScale(d.value)-5} else {return yScale(d.value)-1}}})
            .attr('opacity', function(d) {if (data.symbolType === '1') {return 0.9} else {return 1}})
            .style('stroke-width', function(d) {if (data.symbolType === '2') {return 5} else {return 5}})
            .style('fill', function(d) {if (data.symbolType !== '1') {return 'white'}})

	}
}