/*
	A. Allenspach / P. Meyer / D. Hollenstein
	pyramid_old.js

	1.00 (11.10.2017) Initial
	1.01 Legende angepasst, dass es auch geht, wenn nur categoryTwo existiert
	1.02 (11.10.2017) categoryStatusRotate eingeführt, defaultFontH2 eingeführt
	1.03 (20.10.2017) convert to function
	2.01 (27.03.2020) mouseover & ontouch functions
	2.02 (10.4.2020) rewrite of function categoryResults
 */


function drawPyramid(data) {

	let countResults = 0;
	let defaultCenterDelta = 0;

	let SVGmargin = {	top: data.margin[0].top,
		right: data.margin[0].left,
		bottom: data.margin[0].bottom,
		left: data.margin[0].left};
	let SVGwidth = data.customWidth - SVGmargin.left - SVGmargin.right;
	let SVGheight = data.customHeight - SVGmargin.top - SVGmargin.bottom;
	let fontFamily = data.defaultFontFamily;
	let defaultFontH2 = data.defaultFontH2;

	if (typeof data.defaultCenterDelta !== 'undefined') {
		defaultCenterDelta = data.defaultCenterDelta;
	}

	let numberOfDetails = 1;
	if (typeof data.numberOfDetails !== 'undefined') {
		numberOfDetails = data.numberOfDetails;
	}


	let svg = d3.select("#vizSVG")
	//.style("width", SVGwidth + SVGmargin.left + SVGmargin.right + 'px')
	//.style("height", SVGheight + SVGmargin.top + SVGmargin.bottom + 'px')
		.append("g");

	let viz = svg.append("g");

	if (typeof data.categoryOne !== "undefined") {
		drawSymbols(1,data.categoryTypeOneColor,data.categoryOne,data.categoryTwo,viz,data);
	}

	if (typeof data.categoryTwo !== "undefined") {
		drawSymbols(2,data.categoryTypeTwoColor,data.categoryTwo,data.categoryOne,viz,data);
	}


	caption(svg,data, numberOfDetails, defaultFontH2, fontFamily);


	function writeCategories(svg, dataCategory, data) {
		let rotate = 0;
		let pointX = 0;
		let pointY = 0;
		if (typeof data.categoryStatusRotation !== 'undefined') {
			rotate = data.categoryStatusRotation;
		}
		dataCategory.forEach(function(d) {
			let value = 0;
			if (typeof d.value !== "undefined") {
				value = d.value;
			} else {
				for (let k = 1; k <= d.valueDetails.length; k++) {
					value = value + d.valueDetails[k-1].value;
				}
			}
			// d.spaceCircles = Array.apply(null, {length: value/data.formatValue}).map(Number.call, Number);
			if (countResults === 0) {
				let center = parseFloat(d.id)+parseFloat(0.5);
				let deltaTextAnchor = 0;
				let deltaTextAnchor2 = 0;
				if (typeof data.deltaTextAnchor !== 'undefined') {
					deltaTextAnchor = data.deltaTextAnchor;
				}
				if (typeof data.deltaTextAnchor2 !== 'undefined') {
					deltaTextAnchor2 = data.deltaTextAnchor2;
				}
				let dCorr = 0;
				if (data.textAnchorDesc === 'start') {
					dCorr = 0 - data.defaultTextLength;
				} else if (data.textAnchorDesc === 'end') {
					dCorr = data.defaultTextLength;
				}
				let tempNumberOfDetails = 1;
				if (typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'parallel') {
					tempNumberOfDetails = numberOfDetails;
				}
				if (data.chartDirection === "Y") {
					pointX = data.defaultCenter+dCorr+deltaTextAnchor2;
					pointY = defaultCenterDelta+((center) * data.objectsColumnsPerCategory *data.paddingC * tempNumberOfDetails+
						(d.id-1)*data.paddingLineSpaces  + deltaTextAnchor + SVGmargin.top);
				}
				if (data.chartDirection === "X") {
					pointX = defaultCenterDelta+((center) * data.objectsColumnsPerCategory *data.paddingC * tempNumberOfDetails+
						(d.id-1)*data.paddingLineSpaces +  deltaTextAnchor + SVGmargin.left);
					pointY = data.defaultCenter+dCorr+deltaTextAnchor2;
				}
				let wrapData = 9999;
				if (typeof data.wrapText !== 'undefined') {
					wrapData = data.wrapText;
				}

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
		countResults = countResults +1;

		let results = [];
		let k = 0;
		let dummy = 0;
		for (let i = 1; i <= dataCategory.length; i++) {
			let xDefault = 0;
			let spacesAfterCircles = 0;
			let jj =1;
			let type ="";
			let detailId = 0;
			let oldDetailId = 0;
			let oldtype = '';
			let ii = 0;
			let mNew = 1;
			let value = 0;
			let valueData;
			let tempValue;

           if (typeof dataCategory[i-1].valueDetails !== "undefined") {
                tempValue = Math.round(dataCategory[i-1].valueDetails[mNew-1].value/data.formatValue)*data.formatValue;
            }
			if (typeof dataCategory[i-1].value !== "undefined") {
				value = dataCategory[i-1].value;
				valueData = dataCategory[i-1].value;
			} else {
				for (let l = 1; l <= dataCategory[i-1].valueDetails.length; l++) {
					value = value + Math.round(dataCategory[i-1].valueDetails[l-1].value/data.formatValue)*data.formatValue;
					if (value <= data.formatValue) {
						ii++;
					}
				}
			}

			for (let j = 1; j <= Math.round(value/data.formatValue); j++) {
                let color = "";

				if (typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'parallel') {

                    if ((j*data.formatValue) <= tempValue) {
						type = dataCategory[i-1].valueDetails[mNew-1].type;
						detailId = dataCategory[i-1].valueDetails[mNew-1].id;
						valueData = dataCategory[i-1].valueDetails[mNew-1].value;
						color = dataCategory[i-1].valueDetails[mNew-1].color || data.categoryTypeTwoColor;

					} else {
					    mNew++;
					    tempValue = tempValue+Math.round(dataCategory[i-1].valueDetails[mNew-1].value/data.formatValue)*data.formatValue;
                        type = dataCategory[i-1].valueDetails[mNew-1].type;
                        detailId = dataCategory[i-1].valueDetails[mNew-1].id;
                        valueData = dataCategory[i-1].valueDetails[mNew-1].value;
                        color = dataCategory[i-1].valueDetails[mNew-1].color || data.categoryTypeTwoColor;

					}

					if (oldtype === type ) {
						jj = jj+1;
					} else {
						ii = ii+1;
						xDefault = 0;
						spacesAfterCircles = 0;
						jj= 1;
					}
				} else {
					jj = j;
					ii = 1;
				}

				if (typeof dataColor !== "undefined") {
					color = dataColor;
					if (typeof data.chartTypeDetail !== 'undefined' &&
						data.chartTypeDetail === 'delta') {
						if (j*data.formatValue <= Math.round(otherDataCategory[i-1].value/data.formatValue)*data.formatValue) {
							color = dataColor;
						} else {
						    color = dataColor + "4";

						}
					}
				} else {
					if (typeof dataCategory[i-1].color !== "undefined") {
						color = dataCategory[i-1].color;
						if (typeof data.chartTypeDetail !== 'undefined' &&
							data.chartTypeDetail === 'delta') {
							if (j*data.formatValue <= otherDataCategory[i-1].value) {
								color = dataCategory[i-1].color;
							} else {
								color = color = dataColor + "4";

							}
						}
					} else if (typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'parallel') {
					    color = color;
					} else {
					    if ((j*data.formatValue) <= tempValue) {
					        while (dataCategory[i-1].valueDetails[mNew-1].value === 0) {
					            mNew++;
					        }
                            valueData = dataCategory[i-1].valueDetails[mNew-1].value;
                            color = dataCategory[i-1].valueDetails[mNew-1].color || data.categoryTypeTwoColor;
						} else {
                            mNew++;
                            while (dataCategory[i-1].valueDetails[mNew-1].value === 0) {
					            mNew++;
					        }
                            tempValue = tempValue+Math.round(dataCategory[i-1].valueDetails[mNew-1].value/data.formatValue)*data.formatValue;
                            valueData = dataCategory[i-1].valueDetails[mNew-1].value;
                            color = dataCategory[i-1].valueDetails[mNew-1].color || data.categoryTypeTwoColor;
					    }
					}
				}

				if ((jj-1)%data.objectsColumnsPerCategory === 0) {
					dummy = 1;
				} else {
					dummy = 0;
				}
				if ((jj-1)%data.spacesAfterXObjects === 0) {
					spacesAfterCircles = spacesAfterCircles+1;
				}
				xDefault = xDefault + dummy*data.paddingC;

				results[k] = {};
				results[k].status=dataCategory[i -1].status.replace(/[^a-zA-Z0-9]/g,"-");
				results[k].categoryValue = i -1 + (ii -1)/numberOfDetails;
				results[k].categoryId = dataCategory[i -1].id;
				results[k].yDefault = (jj-1)%data.objectsColumnsPerCategory*data.paddingC;
				results[k].xDefault = xDefault+spacesAfterCircles*data.paddingColumnSpaces;
				results[k].color = color;
				results[k].symbolShape = data.symbolShape;
				results[k].symbolType = data.symbolType;
				results[k].valueData = valueData;
				oldtype = type;
				oldDetailId = detailId;
				k++;
			}
		}
		return results;
	}

	function calcObjectOne(count, xyOneDefault, xyTwoDefault, categoryValue, categoryId, data) {
		let cx = 0;
		let cy = 0;

		if (data.chartDirection === "Y") {

			cx = data.defaultCenter;
			if (count === 1 ) {
				cx = cx - xyOneDefault - data.defaultTextLength ;
			} else {
				cx = cx + xyOneDefault + data.defaultTextLength + SVGmargin.left;
			}

			let tempNumberOfDetails = 1;
			if (data.chartTypeDetail === 'parallel') {
				tempNumberOfDetails = numberOfDetails;
			}
			cy = defaultCenterDelta + xyTwoDefault
				+ categoryValue * data.objectsColumnsPerCategory * data.paddingC * tempNumberOfDetails
				+ categoryId * data.paddingLineSpaces
				+ SVGmargin.top;

		} else {

			let tempNumberOfDetails = 1;
			if (data.chartTypeDetail === 'parallel') {
				tempNumberOfDetails = numberOfDetails;
			}
			cx = defaultCenterDelta + xyTwoDefault
				+ categoryValue * data.objectsColumnsPerCategory * data.paddingC * tempNumberOfDetails
				+ categoryId * data.paddingLineSpaces
				+ SVGmargin.left;

			cy = data.defaultCenter;
			if (count === 1 ) {
				cy = cy - xyOneDefault - data.defaultTextLength + SVGmargin.top;
			} else {
				cy = cy + xyOneDefault + data.defaultTextLength;
			}
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



	function drawSymbols(count,categoryColor,category, otherCategory, svg,data){
		let results = categoryResults(svg, data, categoryColor, category, otherCategory);
		svg.append("g").attr("class", "vizGroup").attr("id", "vizGroup-" + categoryColor)
			.selectAll(".sym")
			.data(results)
			.enter()
			.append("path")
			.attr("value", function(d) {

				return d.valueData;
			})
			.attr('class', (d) => {
				return  "sym sym-"  + d.color;
			})
			.attr("id", (d) => {if (typeof data.chartTypeDetail !== 'undefined' &&
						data.chartTypeDetail === 'delta')
						{return "sym-" + d.status + "-" + d.color.replace("4", "")}
						else
						{return "sym-" + d.status + "-" + d.color}
						})

			.attr('d', function(d) {
				return symbol[d.symbolShape][d.symbolType]})
			.attr("transform", function(d) {
				let [x,y] = calcObjectOne(count, d.xDefault, d.yDefault, d.categoryValue, d.categoryId, data);
				return "rotate("+data.chartObjectTypeOrientation+","+x+","+y+") translate("+ x + "," + y +")"});

		var allClasses = [];
		var classedPaths = d3.select("#vizGroup-" + categoryColor).selectAll("path").each(function(d, i) {
			allClasses.push(d3.select(this).attr("id"));
		});
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}

		var uniqueClasses = allClasses.filter(onlyUnique );

		uniqueClasses.forEach(function(item, index) {
			var newGroup = d3.select(".vizGroup").append('g').attr("class", "pointGroup").attr("id", "g-" + item);
			var pointGroup = d3.selectAll("#" + item);
			pointGroup.each(function() {document.getElementById( "g-" + item).appendChild(this)});

			var bbGroup = d3.select("#g-" + item).node().getBBox();

			newGroup.append('rect').attr("class", "containerRect")
				.attr("x", bbGroup.x)
				.attr("y", bbGroup.y)
				.attr("width", bbGroup.width)
				.attr("height", bbGroup.height)
				.style("opacity", "0")
				.style("fill", "white")
				.style("stroke", "black");

			var newGroup = d3.select("#g-" + item);

			newGroup
			    .on("mouseover", function() {
                    let firstChild = d3.select(this).node().childNodes[0];
                    let textValue = firstChild.getAttribute("value");
                    let groupID=d3.select(this).attr("id");
                    let pointID = groupID.slice(2);
                    hoveredPoints = d3.selectAll("#"+pointID).style("opacity",0.5);
                    tooltip.style("visibility", "visible")
                        .style("top", (d3.event.pageY - 20) + "px")
                        .style("left", (d3.event.pageX + 20) + "px")
                        .text(textValue);
			    })

				.on("mouseout", function(){
					hoveredPoints.style("opacity",1);
					tooltip.style("visibility", "hidden").text("");
				})

				.on("touchstart", function(){
                        var y = d3.event.touches[0].pageY;
                        var x = d3.event.touches[0].pageX;
                        var targetElement = document.elementFromPoint(x,y);
                        if (targetElement && targetElement.getAttribute("class") === "containerRect") {
                            var groupID = targetElement.parentElement.getAttribute("id");
                            touchedPoints = d3.selectAll("#"+ groupID).style("opacity",0.5);
                            tooltip.style("visibility", "visible")
                                .style("top", (d3.event.touches[0].pageY - 70) + "px")
                                .style("left", (d3.event.touches[0].pageX - 70) + "px")
                                .text(targetElement.parentElement.childNodes[0].getAttribute("value"));
                         }
			        })

                    .on("touchmove", function(){
                        touchedPoints.style("opacity",1);
                        tooltip.style("visibility", "hidden").text("");
                        var y = d3.event.touches[0].pageY;
                        var x = d3.event.touches[0].pageX;
                        var targetElement = document.elementFromPoint(x,y);
                        if (targetElement && targetElement.getAttribute("class") === "containerRect") {
                            var groupID = targetElement.parentElement.getAttribute("id");
                            touchedPoints = d3.selectAll("#"+ groupID).style("opacity",0.5);
                            tooltip.style("visibility", "visible")
                                .style("top", (d3.event.touches[0].pageY - 70) + "px")
                                .style("left", (d3.event.touches[0].pageX - 70) + "px")
                                .text(targetElement.parentElement.childNodes[0].getAttribute("value"));
                        }
			    })

                   .on("touchend", function(){
                        touchedPoints.style("opacity",1);
                        tooltip.style("visibility", "hidden").text("");
                    });

		})
	}

}

