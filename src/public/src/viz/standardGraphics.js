/* A. Allenspach
 Name: standardGraphics.js
 Version : 1.00

 generelle Funktionen fuer alle Grafiken
 */


function wrap(text, width) {
	text.each(function () {
		let text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(word);
				lineNumber++;
			}
		}
	});
}

function drawPentagonCaption(svg, data, captionX, captionY, radius, strokeWidth, radius2, color) {

	let sin36 = Math.sin(36 * Math.PI / 180.0);
	let cos36 = Math.cos(36 * Math.PI / 180.0);
	let sin72 = Math.sin(72 * Math.PI / 180.0);
	let cos72 = Math.cos(72 * Math.PI / 180.0);
	let points = ((captionX - sin36 * radius) + ',' + (captionY + cos36 * radius) + " " +
	(captionX + sin36 * radius) + ',' + (captionY + cos36 * radius) + " " +
	(captionX + sin72 * radius) + ',' + (captionY - cos72 * radius) + " " +
	captionX + ',' + (captionY - radius) + " " +
	(captionX - sin72 * radius) + ',' + (captionY - cos72 * radius));
	let rotate = "rotate(0)";
	if (typeof data.chartObjectTypeOrientation !== 'undefined') {
		rotate = "rotate(" + data.chartObjectTypeOrientation + "," + captionX + "," + captionY + ")";
	}

	svg.append("polygon")
		.attr("class", color)
		.attr("points", points)
		.attr("transform", rotate)
		.style("fill", "none")
		.style("stroke-width", strokeWidth);

	if (typeof radius2 !== 'undefined' && radius2 > 0) {
		points = ((captionX - sin36 * radius2) + ',' + (captionY + cos36 * radius2) + " " +
		(captionX + sin36 * radius2) + ',' + (captionY + cos36 * radius2) + " " +
		(captionX + sin72 * radius2) + ',' + (captionY - cos72 * radius2) + " " +
		captionX + ',' + (captionY - radius2) + " " +
		(captionX - sin72 * radius2) + ',' + (captionY - cos72 * radius2));
		svg.append("polygon")
			.attr("class", color)
			.attr("points", points)
			.attr("transform", rotate)
			.style("fill", "none")
			.style("stroke-width", 1);
	}
}

function caption(svg, data, numberOfDetails) {

	let captionX = 10;
	let captionY = 0;
	let delta = 5;
	let textCaptionBefore = '';
	let textCaptionAfter = '';
	const rowGap = 3;
	const captionFirstRowGap = 20;
	const defaultFontH2 = data.defaultFontH2;
	const fontFamily = data.defaultFontFamily;

	if (typeof data.captionX !== 'undefined') {
		captionX = data.captionX;
	}
	if (typeof data.captionY !== 'undefined') {
		captionY = data.captionY;
	}
	if (typeof data.textCaptionBefore !== 'undefined') {
		textCaptionBefore = data.textCaptionBefore;
	}
	if (typeof data.textCaptionAfter !== 'undefined') {
		textCaptionAfter = data.textCaptionAfter;
	}

	let legend = svg.append('g').attr('id', 'legend').attr("font-weight", "bold").attr("border",20);

    let legend_2 = svg.append('g').attr('id', 'legend');

	drawCaptionSymbol(legend,captionX,captionY,data.symbolShape,data.symbolType,"darkGrey-primary-0");
	if (data.vizLib !== 'undefined' && data.vizLib === 'bar') {
        drawCaptionText(legend, textCaptionBefore, '', textCaptionAfter, captionX, captionY, delta, fontFamily, defaultFontH2);
    } else {
	    drawCaptionText(legend, textCaptionBefore, data.formatValue, textCaptionAfter, captionX, captionY, delta, fontFamily, defaultFontH2);
    }
	captionY += captionFirstRowGap;

	if (data.caption === 'master' ) {

		if (typeof data.categoryOne !== 'undefined' && data.categoryType !== "Diff-Spezialfall") {
			captionY += defaultFontH2*1.4;
			drawCaptionSymbol(legend_2,captionX,captionY,data.symbolShape,data.symbolType,data.categoryTypeOneColor);
			drawCaptionText(legend_2, "", "", data.categoryTypeOne, captionX, captionY, delta, fontFamily, defaultFontH2);
		}
		if (typeof data.categoryTwo !== 'undefined') {
			captionY += defaultFontH2*1.4;
			drawCaptionSymbol(legend_2,captionX,captionY,data.symbolShape,data.symbolType,data.categoryTypeTwoColor);
			drawCaptionText(legend_2, "", "", data.categoryTypeTwo, captionX, captionY, delta, fontFamily, defaultFontH2);
		}
		// nur für "pyramid_old.js" wenn Differenz zwischen links/rechts bzw. oben/unten gezeigt werden soll!!!!
		if (typeof data.chartTypeDetail !== 'undefined' && data.chartTypeDetail === 'delta') {
			captionY += defaultFontH2*1.4;

			drawCaptionSymbol(legend_2,captionX,captionY,data.symbolShape,data.symbolType,data.categoryTypeOneColor + 4);
			drawCaptionSymbol(legend_2,captionX-7,captionY,data.symbolShape,data.symbolType,data.categoryTypeTwoColor + 4);
			drawCaptionText(legend_2, "", "", data.textCaptionDifference, captionX, captionY, delta, fontFamily, defaultFontH2);
		}

	} else if (data.caption === 'detail') {

		for (let i = 1; i <= numberOfDetails; i++) {
			let tempText = '-';
			let tempColor ='';
			if (typeof data.categoryOne !== 'undefined') {
				tempText = data.categoryOne[0].valueDetails[i-1].type;
				tempColor = data.categoryOne[0].valueDetails[i-1].color;
			} else if (typeof data.categoryTwo !== 'undefined') {
				tempText = data.categoryTwo[0].valueDetails[i-1].type;
				tempColor = data.categoryTwo[0].valueDetails[i-1].color;
			}
			drawCaptionSymbol(svg,captionX,captionY + i*(defaultFontH2 + rowGap),data.symbolShape,data.symbolType,tempColor);
			drawCaptionText(svg, "", "", tempText, captionX, captionY, delta+i*(defaultFontH2 + rowGap), fontFamily, defaultFontH2);

		}

	}

}

function drawCaptionText(svg, textCaptionBefore, formatValue, textCaptionAfter, captionX, captionY, delta, fontFamily, defaultFontH2) {

	svg.append('text').text(textCaptionBefore + formatValue + " "+ textCaptionAfter)
		.attr("dx",0)
		.attr("x",captionX+15)
		.attr("dy",0)
		.attr("y", delta+captionY)
		.attr('font-family', fontFamily)
		.attr('font-size', defaultFontH2)

		.style("text-anchor", "start");
}

function drawCaptionSymbol(svg, captionX, captionY, symbolType, symbolNumber, color) {

	svg.append("path")
		.attr('class', "sym legend" + "sym sym-" + color)
		.attr('d', symbol[symbolType][symbolNumber])
		.attr("transform", "translate("+ captionX + "," + captionY +")");
}



function deg2rad(deg) {
	return deg/180*Math.PI;
}

function rad2deg(rad) {
	return rad*180/Math.PI;
}