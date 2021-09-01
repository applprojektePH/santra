/*
	A. Allenspach / P. Meyer / D. Hollenstein
	difference_test.js

	1.00 (11.10.2017) Initial
	1.01 (20.10.2017) convert to function
	2.01 (27.03.2020) mouseover & ontouch functions
	2.02 (08.04.2020) changed from Math.floor to Math.round for calculating the number of symbols
*/


function drawDifference(data) {

	let defaultCenterDelta;
	let defaultCenter;

	if (typeof data.defaultCenter !== 'undefined') {
		defaultCenter = data.defaultCenter;
	}

	data.categoryTypeOneColor = data.categoryTypeColor;
	data.categoryTwo = {};
	data.categoryTypeTwoColor = data.categoryTypeDiffColor;
	data.categoryTypeOne = data.categoryType;
	data.categoryTypeTwo = data.categoryTypeDiff;


	let marginSVG = {
		top: data.margin[0].top+defaultCenter,
		right: data.margin[0].left,
		bottom: data.margin[0].bottom,
		left: data.margin[0].left
	};
	let widthSVG = data.customWidth - marginSVG.left - marginSVG.right;
	let heightSVG = data.customHeight - marginSVG.top - marginSVG.bottom;
	let fontFamily = data.defaultFontFamily;
	let defaultFontH2 = data.defaultFontH2;

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

	if (typeof data.defaultCenterDelta !== 'undefined') {
		defaultCenterDelta = data.defaultCenterDelta;
	}

	let svg = d3.select("#vizSVG")
	//.attr("width", widthSVG + marginSVG.left + marginSVG.right)
	//.attr("height", heightSVG + marginSVG.top + marginSVG.bottom)
		.append("g");

	let maxValue = maxValueC(data.categoryOne[0].valueDetails);
	let maxValueDiff = maxDiffValueC(data.categoryOne[0].valueDetails);
	let maxValueDiffNeg = maxDiffValueCNeg(data.categoryOne[0].valueDetails);

	let maxNumberOfSymbolsPerColumn = Math.round(maxValue / data.objectsColumnsPerCategory / data.formatValue);
	let numberOfColumnSpaces = Math.floor((maxNumberOfSymbolsPerColumn -1) / (data.spacesAfterXObjects / data.objectsColumnsPerCategory));
	let heightOfValueColumn = (maxNumberOfSymbolsPerColumn-1) * data.paddingC + numberOfColumnSpaces * data.paddingColumnSpaces;

	let maxNumberOfSymbolsPerColumnDiff = Math.round(maxValueDiff / data.objectsColumnsPerCategory / data.formatValueDiff);
	let numberOfColumnSpacesDiff = Math.floor((maxNumberOfSymbolsPerColumnDiff -1) / (data.spacesAfterXObjects / data.objectsColumnsPerCategory));
	let heightOfValueColumnDiff = (maxNumberOfSymbolsPerColumnDiff-numberOfColumnSpacesDiff) * data.paddingC + numberOfColumnSpacesDiff * data.paddingColumnSpaces;


	let maxNumberOfSymbolsPerColumnDiffNeg = Math.round(maxValueDiffNeg / data.objectsColumnsPerCategory / data.formatValueDiff);
	let numberOfColumnSpacesDiffNeg = Math.floor((maxNumberOfSymbolsPerColumnDiffNeg -1) / (data.spacesAfterXObjects / data.objectsColumnsPerCategory));
	let heightOfValueColumnDiffNeg = (maxNumberOfSymbolsPerColumnDiffNeg-numberOfColumnSpacesDiffNeg) * data.paddingC + numberOfColumnSpacesDiffNeg * data.paddingColumnSpaces;

	let horizontalLineY = heightOfValueColumn + heightOfValueColumnDiff + data.gapBetweenCharts + marginSVG.top;

	drawSymbols(data.categoryTypeColor, data.categoryTypeDiffColor, svg, data);
	caption(svg, data, 0);

	writeCategories(svg, data, horizontalLineY, heightOfValueColumnDiffNeg);

	if (maxNumberOfSymbolsPerColumn !== 0) {
		$('#legend').children()[0].remove();
		$('#legend').children()[0].remove();
		$('#legend').attr('transform', 'translate(0,-25)')
	}


	function drawSymbols(categoryColor, categoryDiffColor, svg, data){
		let results = categoryResultsNew(data, 'value');
		let resultsDiffNew = categoryResultsNew(data, 'diff');

		svg.append("g").attr("id", "vizData")
			.selectAll(".sym")
			.data(results)
			.enter()
			.append("path")
			.attr('class', "sym sym-" + categoryColor)
			.attr("id", (d) => {return "sym-" + d[2] + "-" + categoryColor})
			.attr("value", (d) => {return d[3]})
			.attr('d', symbol[data.symbolShape][data.symbolType])
			.attr("transform", function(d) {
				let x = d[0] + marginSVG.left + data.defaultCenterDelta;
				let y = heightOfValueColumn + marginSVG.top - d[1];
				return "rotate("+data.chartObjectTypeOrientation+","+x+","+y+") translate("+ x + "," + y +")"});

		var allClasses = [];
		var classedPaths = d3.select("#vizData").selectAll("path").each(function(d, i) {
			allClasses.push(d3.select(this).attr("id"));
		});

		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}

		var uniqueClasses = allClasses.filter(onlyUnique);

		uniqueClasses.forEach(function(item, index) {
			var newGroup = d3.select("#vizData").append('g').attr("class", "pointGroup").attr("id", "g-" + item);
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
			    .on("mouseover", onmouseover)
				.on("mouseout", onmousout)
				.on("touchstart", ontouchstart)
                .on("touchmove", ontouchmove)
                .on("touchend", ontouchend);
		})


		svg.append("g").attr("id", "vizDelta")
			.selectAll(".sym")
			.data(resultsDiffNew)
			.enter()
			.append("path")
			.attr('class', "sym sym-" + categoryDiffColor)
			.attr("id", (d) => {return "sym-" + d[2] + "-" + categoryDiffColor})
			.attr("value", (d) => {return d[3]})
			.attr('d', symbol[data.symbolShape][data.symbolType])
			.attr("transform", function(d) {
				let x = d[0] + marginSVG.left + data.defaultCenterDelta;
				let y = horizontalLineY - d[1];
				return "rotate("+data.chartObjectTypeOrientation+","+x+","+y+") translate("+ x + "," + y +")"})

		var allClasses = [];
		var classedPaths = d3.select("#vizDelta").selectAll("path").each(function(d, i) {
			allClasses.push(d3.select(this).attr("id"));
		});

		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}

		var uniqueClasses = allClasses.filter(onlyUnique);

		uniqueClasses.forEach(function(item, index) {
			var newGroup = d3.select("#vizDelta").append('g').attr("class", "pointGroup").attr("id", "g-" + item);
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
			    .on("mouseover", onmouseover)
				.on("mouseout", onmousout)
				.on("touchstart", ontouchstart)
                .on("touchmove", ontouchmove)
                .on("touchend", ontouchend);
		})

	}

    function onmouseover() {
        let firstChild = d3.select(this).node().childNodes[0];
        let groupID=d3.select(this).attr("id");
        let pointID = groupID.slice(2);
        hoveredPoints = d3.selectAll("#"+pointID).style("opacity",0.5);
        tooltip.style("visibility", "visible")
            .style("top", (d3.event.pageY - 20) + "px")
            .style("left", (d3.event.pageX + 20) + "px")
            .text(firstChild.getAttribute("value"));
    }

    function onmousout() {
        hoveredPoints.style("opacity",1);
        tooltip.style("visibility", "hidden").text("");
    }

    function ontouchstart() {
        var y = d3.event.touches[0].pageY;
        var x = d3.event.touches[0].pageX;
        var targetElement = document.elementFromPoint(x,y);
        if (targetElement && targetElement.getAttribute("class") === "containerRect") {
            var groupID = targetElement.parentElement.getAttribute("id").slice(2);
            touchedPoints = d3.selectAll("#"+ groupID).style("opacity",0.5);
            tooltip.style("visibility", "visible")
                .style("top", (d3.event.touches[0].pageY - 70) + "px")
                .style("left", (d3.event.touches[0].pageX - 70) + "px")
                .text(targetElement.parentElement.childNodes[0].getAttribute("value"));
         }
    }

    function ontouchmove() {
        touchedPoints.style("opacity",1);
        tooltip.style("visibility", "hidden").text("");
        var y = d3.event.touches[0].pageY;
        var x = d3.event.touches[0].pageX;
        var targetElement = document.elementFromPoint(x,y);
        if (targetElement && targetElement.getAttribute("class") === "containerRect") {
            var groupID = targetElement.parentElement.getAttribute("id").slice(2);
            touchedPoints = d3.selectAll("#"+ groupID).style("opacity",0.5);
            tooltip.style("visibility", "visible")
                .style("top", (d3.event.touches[0].pageY - 70) + "px")
                .style("left", (d3.event.touches[0].pageX - 70) + "px")
                .text(targetElement.parentElement.childNodes[0].getAttribute("value"));
        }
    }

    function ontouchend() {
        touchedPoints.style("opacity",1);
        tooltip.style("visibility", "hidden").text("");
    }

	function writeCategories(svg, data, yStart, heightValueColumnDiffNeg) {
		let dataCategory = data.categoryOne[0].valueDetails;

		svg.append('line')
			.attr('x1', marginSVG.left + data.defaultCenterDelta)
			.attr('y1', yStart)
			.attr('x2', dataCategory.length * (data.paddingLineSpaces + data.paddingC*data.objectsColumnsPerCategory) + data.defaultCenterDelta)
			.attr('y2', yStart)
			.style('stroke-width', 2)
			.style('stroke', 'black');

		dataCategory.forEach(function (d) {

			let value = 0;
			if (typeof d.value !== "undefined") {
				value = d.value;
			}

			// d.spaceCircles = Array.apply(null, {length: value / data.formatValue}).map(Number.call, Number);
			let center = parseFloat(d.id) + parseFloat(0.5);
			let center2 = parseFloat(d.id);
			let deltaTextAnchor = 0;
			let deltaTextAnchor2 = 0;
			if (typeof data.deltaTextAnchor !== 'undefined') {
				deltaTextAnchor = data.deltaTextAnchor;
			}
			if (typeof data.deltaTextAnchor2 !== 'undefined') {
				deltaTextAnchor2 = data.deltaTextAnchor2;
			}
			let tempNumberOfDetails = 1;

			let pointX = defaultCenterDelta + ((center) * data.objectsColumnsPerCategory * data.paddingC * tempNumberOfDetails +
				(d.id - 1) * data.paddingLineSpaces + deltaTextAnchor + marginSVG.left +15);
			let pointY = yStart + heightValueColumnDiffNeg + deltaTextAnchor2;

			let wrapData = 9999;
			if (typeof data.wrapText !== 'undefined') {
				wrapData = data.wrapText;
			}

			let rotate = 0;
			if (typeof data.categoryStatusRotation !== 'undefined') {
				rotate = data.categoryStatusRotation;
			}
			let pointXLineBeg = defaultCenterDelta + ((center2) * data.objectsColumnsPerCategory * data.paddingC * tempNumberOfDetails +
				(d.id - 1) * data.paddingLineSpaces + /*deltaTextAnchor +*/ marginSVG.left +15);


			if (d.total === 'true') {
				svg.append('line')
					.attr('x1', pointXLineBeg)
					.attr('y1', marginSVG.top - data.defaultCenter)
					.attr('x2', pointXLineBeg)
					.attr('y2', pointY + 30)
					.style('stroke-dasharray', ('3, 3'))
					.style('stroke-width', 2)
					.style('stroke', 'black');
			}


			svg.append('text').text(d.status) //d.status)
				.attr("dx", 0)
				.attr("x", pointX)
				.attr("dy", 0)
				.attr("y", pointY)
				.attr('font-family', fontFamily)
				.attr('font-size', defaultFontH2)
				.attr('transform', 'rotate(' + rotate + ',' + pointX + ',' + (pointY) + ')')
				.style("text-anchor", data.textAnchorDesc)
				.style("alignment-baseline", data.alignmentBaselineDesc)
				.call(wrap, wrapData);
		});
	}

	function maxValueC(dataCategory) {
		let value = 0;
		for (let i = 1; i <= dataCategory.length; i++) {
			if (value < dataCategory[i - 1].value) {
				value = dataCategory[i - 1].value;
			}
		}
		return value;
	}

	function maxDiffValueC(dataCategory) {
		let value = 0;
		for (let i = 1; i <= dataCategory.length; i++) {
			if (value < dataCategory[i - 1].valueDiff) {
				value = dataCategory[i - 1].valueDiff;
			}
		}
		return value;
	}

	function maxDiffValueCNeg(dataCategory) {
		let value = 0;
		for (let i = 1; i <= dataCategory.length; i++) {
			if (value > dataCategory[i - 1].valueDiff) {
				value = dataCategory[i - 1].valueDiff;
			}
		}
		return Math.abs(value);

	}

	function categoryResultsNew(data, type) {

		let dataCategory = data.categoryOne[0].valueDetails;
		let results = [];



		for (let i = 0; i < dataCategory.length; i++) {


			let value = dataCategory[i].value;
			let status = dataCategory[i].status.replace(/[^a-zA-Z0-9]/g,"");
			let formatValue = data.formatValue;
			if (type === 'diff') {
				value = dataCategory[i].valueDiff;
				formatValue = data.formatValueDiff;
			}


			//let numberOfSymbols = Math.abs(Math.floor(value / formatValue));
            let numberOfSymbols = Math.abs(Math.round(value / formatValue));
			for (let j = 0; j < numberOfSymbols; j++) {

				// column number inside category
				let columnNumberInsideCategory = j % data.objectsColumnsPerCategory;
				// number of spaces (after x symbols)
				let numberOfSpacesAfterXSymbols = Math.floor(j / data.spacesAfterXObjects);

				let rowNumberInsideCategory = Math.floor(j / data.objectsColumnsPerCategory);

				let x = data.paddingC*0.75 + columnNumberInsideCategory * data.paddingC + i * data.paddingLineSpaces + i * data.paddingC * data.objectsColumnsPerCategory;
				let y = Math.sign(value) * (data.paddingC/2 + rowNumberInsideCategory * data.paddingC + numberOfSpacesAfterXSymbols * data.paddingColumnSpaces);

				results.push([x,y,status,value]);

			}
		}

		return results;

	}




}

