/*
 A. Allenspach / P. Meyer / L. Doenni / D. Hollenstein
 slope.js

 1.00 (11.10.2017) Initial
 1.01 (20.10.2017) convert to function
 2.00 (22.11.2017) total new construction
 2.01 (18.06.2019) new counting --> difference between pillars.
 2.02 (27.03.2020)Mousover & ontouch functions, added two-color diff legend
 2.03 (08.4.2020) changed from Math.floor to Math.round for calculating the number of symbols
 */


function drawSlope(dataFile) {

  // set height and width to svg element
  let svg = d3.select("#vizSVG")
      .attr("width", dataFile.customWidth)
      .attr("height", dataFile.customHeight);

  //append g to svg (where all the viz goes)
  let viz = svg.append("g")
      .attr("transform", "rotate(" + 180 + "," + dataFile.defaultCenter + "," + (dataFile.customHeight-80) + ") translate(" + dataFile.defaultCenter + "," + (dataFile.customHeight-80) + ")");

  //get all the data and symbol positions needed for slope
  let drawData = dataHandlerForSlope(dataFile);

  //get sums of category1 and category2
  let sums = getSum(drawData);


  //draws the symbols
  drawSymbols(viz, drawData, dataFile);

  //draws coloured lines between pillars
  if (typeof dataFile.slope !== 'undefined' && dataFile.slope === 'true') {
    drawConnectorLines(viz, drawData, dataFile, sums);
  }

  //draws coloured category names on the right
  if (typeof dataFile.categoryCaption !== 'undefined' && dataFile.categoryCaption === 'true') {
    drawCategoryNames(viz, drawData, dataFile);
  }

  //draws pillar names on the bottom
  drawPillarNames(viz, dataFile);

  //add captions
  caption(svg, dataFile, dataFile.numberOfDetails);


  /**
   * Function to return array of categories to be used for drawing all the features.
   * @param dataFile
   * @returns {Array}
   * ******************************************************************************
   * name: name of category
   * color: color of category
   * valueLeft: the absolute value of left pillar category (from file)
   * valueRight: the absolute value of right pillar category (from file)
   * numberOfSymbolsLeft: number of symbols of left pillar category
   * numberOfSymbolsRight: number of symbols of right pillar category
   * blockLeft: positions of symbols of left pillar category
   * blockRight: positions of symbols of right pillar category
   * blockLeftHeight: height of left block
   * blockRightHeight: height of right block
   * ******************************************************************************
   */
  function dataHandlerForSlope(dataFile) {

    let categories = dataFile.category;
    let drawData = [];

    for (let i = 0; i < categories.length; i++) {
      let name = categories[i].status;
      let color = categories[i].color;
      let valueLeft = categories[i].value1;
      let valueRight = categories[i].value2;
      let numberOfSymbolsLeft = Math.round(valueLeft / dataFile.formatValue);
      let numberOfSymbolsRight = Math.round(valueRight / dataFile.formatValue);
      let blockLeft = getBlock(numberOfSymbolsLeft, dataFile.paddingC, dataFile.objectsColumnsPerCategory, dataFile.spacesAfterXObjects, dataFile.paddingColumnSpaces, 'r2l');
      let blockRight = getBlock(numberOfSymbolsRight, dataFile.paddingC, dataFile.objectsColumnsPerCategory, dataFile.spacesAfterXObjects, dataFile.paddingColumnSpaces, 'l2r');
      let blockLeftHeight = blockLeft.reduce((max, coordinate) => Math.max(coordinate.y, max), 0);
      let blockRightHeight = blockRight.reduce((max, coordinate) => Math.max(coordinate.y, max), 0);

      drawData.push({
        name: name,
        color: color,
        valueLeft: valueLeft,
        valueRight: valueRight,
        numberOfSymbolsLeft: numberOfSymbolsLeft,
        numberOfSymbolsRight: numberOfSymbolsRight,
        blockLeft: blockLeft,
        blockRight: blockRight,
        blockLeftHeight: blockLeftHeight,
        blockRightHeight: blockRightHeight
      })
    }
    return drawData;
  }



  /**
   * Function to calculate sum of values on each pillar
   * @param drawData
   * @returns {[*,*]}
   */
  function getSum(drawData) {

    let sumLeft = drawData.reduce((sum, data) => sum + data.valueLeft, 0);
    let sumRight = drawData.reduce((sum, data) => sum + data.valueRight, 0);

    return [sumLeft, sumRight];
  }


  const tooltip = d3.select("body")
      .append("text")
      .attr("id", "mytooltip")
      .style("position", "absolute")
      .style("z-index", "100000")
      .style("background", "#f3f3f3")
      .style("padding", "3px")
      .style("border-radius", "8px")
      .style("visibility", "hidden")
      .attr('font-family', dataFile.defaultFontFamily)
      .attr('font-size', dataFile.defaultFontH2)
      .attr('font-weight', "bold")
      .style('text-anchor', 'left');



  /**
   * Function to draw the symbols according to draw data
   * @param svg
   * @param dataToDraw
   * @param dataFile
   */
  function drawSymbols(svg, dataToDraw, dataFile) {

    //current value of y (height) of the start of each category
    let yStart = 0;



    //iterate over all categories
    for (let i = 0; i < dataToDraw.length; i++) {
      //left pillar
      svg.append("g").attr("id", "sym-left-" + dataToDraw[i].color)
      //transforms the (relative) block to its absolute position (to the left and a certain y (height))
          .attr("transform", "translate(" + (dataFile.gapBetweenPillars / 2) + "," + yStart + ")")
          //add all symbols
          .selectAll(".sym")
          .data(dataToDraw[i].blockLeft)
          .enter()
          .append("path")
          .attr('class', (d) => {
            return "sym-left" + " sym sym-" + dataToDraw[i].color;
          })

          .attr('d', symbol [dataFile.symbolShape][dataFile.symbolType])
          .attr('value', dataFile.category[i].value1)
          .attr("transform", function (d) {
            return "rotate(" + dataFile.chartObjectTypeOrientation + "," + d.x + "," + d.y + ") translate(" + d.x + "," + d.y + ")"
          });

          //append rect to group for brushing
          var bbGroup = d3.select("#sym-left-" + dataToDraw[i].color).node().getBBox();
          var pointGroupLeft = d3.select("#sym-left-" + dataToDraw[i].color)
                .append('rect').attr("class", "containerRect")
				.attr("x", bbGroup.x)
				.attr("y", bbGroup.y)
				.attr("width", bbGroup.width)
				.attr("height", bbGroup.height)
				.style("opacity", "0")
				.style("fill", "white")
				.style("stroke", "black");


          var pointGroupLeft = d3.select("#sym-left-" + dataToDraw[i].color)

            .on("mouseover", onmouseover)

            .on("mouseout", onmouseout)

            .on("touchstart", ontouchstart)

            .on("touchmove", ontouchmove)

           .on("touchend", ontouchend);


      //right pillar
      svg.append("g").attr("id", "sym-right-" + dataToDraw[i].color)
      //transforms the (relative) block to its absolute position (to the right and a certain y (height))
          .attr("transform", "translate(" + (-dataFile.gapBetweenPillars / 2) + "," + yStart + ")")
          //add all symbols
          .selectAll(".sym")
          .data(dataToDraw[i].blockRight)
          .enter()
          .append("path")
          .attr('class', () => {
            return  "sym right" +" sym sym-" + dataToDraw[i].color;
          })

          .attr('d', symbol[dataFile.symbolShape][dataFile.symbolType])
          .attr('value', dataFile.category[i].value2)
          .attr("transform", function (d) {
            return "rotate(" + dataFile.chartObjectTypeOrientation + "," + d.x + "," + d.y + ") translate(" + d.x + "," + d.y + ")"
          });

          //append rect to group for smooth brushing
          var bbGroup = d3.select("#sym-right-" + dataToDraw[i].color).node().getBBox();
          var pointGroupRight = d3.select("#sym-right-" + dataToDraw[i].color)
                .append('rect').attr("class", "containerRect")
				.attr("x", bbGroup.x)
				.attr("y", bbGroup.y)
				.attr("width", bbGroup.width)
				.attr("height", bbGroup.height)
				.style("opacity", "0")
				.style("fill", "white")
				.style("stroke", "black");


          var pointGroupRight = d3.select("#sym-right-" + dataToDraw[i].color)

            .on("mouseover", onmouseover)

            .on("mouseout", onmouseout)

            .on("touchstart", ontouchstart)

            .on("touchmove", ontouchmove)

            .on("touchend", ontouchend);


      //calc the maximum height of both sides
      let maxHeight = Math.max(dataToDraw[i].blockLeftHeight, dataToDraw[i].blockRightHeight);
      //add the maxHeight and some spaces to yStart to get the new yStart for both sides (that they start on the same level/height)
      yStart += maxHeight + dataFile.paddingLineSpaces + dataFile.paddingC;
    }

  }

  function onmouseover() {
    let firstChild = d3.select(this).node().childNodes[0];
    pointClass = firstChild.getAttribute("class").split(' ').join('.');
    hoveredPoints = d3.selectAll("."+pointClass).style("opacity",0.5);
    tooltip.style("visibility", "visible")
        .style("top", (d3.event.pageY - 20) + "px")
        .style("left", (d3.event.pageX + 20) + "px")
        .text(firstChild.getAttribute("value"));
  }

  function onmouseout() {
    hoveredPoints.style("opacity", 1);
    tooltip.style("visibility", "hidden").text("");
  }

  function ontouchstart() {
        var y = d3.event.touches[0].pageY;
        var x = d3.event.touches[0].pageX;
        var targetElement = document.elementFromPoint(x,y);
        if (targetElement && targetElement.getAttribute("class") === "containerRect") {
            var groupID = targetElement.parentElement.getAttribute("id");
            touchedPoints = d3.selectAll("#"+ groupID).selectAll('path').style("opacity",0.5);
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
        var groupID = targetElement.parentElement.getAttribute("id");
        touchedPoints = d3.selectAll("#"+ groupID).selectAll('path').style("opacity",0.5);
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

  /**
   * Function to draw lines between pillar and adds percentage texts
   * @param svg svg to draw into
   * @param drawData
   * @param dataFile
   * @param sums
   */
  function drawConnectorLines(svg, drawData, dataFile, sums) {

    const symSize = 9;

    //y coordinates for left and right side
    let pointYLeft = 0;
    let pointYRight = 0;

    //x coordinate for left and right side
    const pointXLeft = dataFile.gapBetweenPillars / 2 - symSize;
    const pointXRight = -pointXLeft;

    //offset for text anchor position
    const textDeltaY = 15;
    const textDeltaX = 15;

    //iterate over all categories
    drawData.forEach((data) => {

      //add height of each block
      pointYLeft += data.blockLeftHeight;
      pointYRight += data.blockRightHeight;

      let pointYDelta = (pointYRight-pointYLeft) * symSize / dataFile.gapBetweenPillars;
      let DifRaw = (((data.valueLeft / sums[0]) * 100) - ((data.valueRight / sums[1] * 100)));
      let DifAbs= Math.abs(Math.round(DifRaw));


      newY = pointYRight - pointYLeft; // Prepear angle and location of the sign.
      newX = pointXRight - pointXLeft;
      let dist = (newX/5);
      theta = Math.atan2(newY, newX);
      let angle = (theta * 180 /Math.PI);






      //append line from left to right
      svg.append('line')
          .attr('class', data.color)
          .attr('x1', pointXLeft)
          .attr('y1', pointYLeft + pointYDelta)
          .attr('x2', pointXRight)
          .attr('y2', pointYRight - pointYDelta)
          .style('stroke-dasharray', ('3, 3'))
          .style('stroke-width', 2);



      //append text in percent with text anchor offsets on the left side
      svg.append('text')
          .attr('class', "sym sym-" +data.color)
          .attr("dx", textDeltaX)
          .attr("x", pointXLeft - dist ) //bring text to the middle of the line
          .attr("dy", -textDeltaY - dataFile.deltaTextAnchorLeft)
          .attr("y", pointYLeft +35)
          .attr('font-family', dataFile.defaultFontFamily)
          .attr('font-size', dataFile.defaultFontH2)
          .attr('font-weight', dataFile.defaultFontWeight)
          .attr('transform', `rotate(${angle},${pointXLeft},${pointYLeft})`); //change angle of the text to angle of the line



      //append text in percent with text anchor offsets on the left side
      svg.append('text').text(Math.round(data.valueLeft / sums[0] * 100) + " %")
          .attr('class', 'sym sym-' + data.color)
          .attr("dx", textDeltaX)
          .attr("x", pointXLeft)
          .attr("dy", -textDeltaY - dataFile.deltaTextAnchorLeft)
          .attr("y", pointYLeft)
          .attr('font-family', dataFile.defaultFontFamily)
          .attr('font-size', dataFile.defaultFontH2)
          .attr('font-weight', dataFile.defaultFontWeight)
          //needs to be rotated because the surrounding g is rotated by 180
          .attr('transform', `rotate(180,${pointXLeft},${pointYLeft})`)
          .attr('transform', `rotate(${angle},${pointXLeft},${pointYLeft})`);


      //append text in percent with text anchor offsets on the right side
      svg.append('text').text(Math.round(data.valueRight / sums[1] * 100) + " %")
          .attr('class', 'sym sym-' + data.color)
          .attr("dx", -textDeltaX)
          .attr("x", pointXRight)
          .attr("dy", -textDeltaY - dataFile.deltaTextAnchorRight)
          .attr("y", pointYRight)
          .style('text-anchor', 'end')
          .attr('font-family', dataFile.defaultFontFamily)
          .attr('font-size', dataFile.defaultFontH2)
          //needs to be rotated because the surrounding g is rotated by 180
          .attr('font-weight', dataFile.defaultFontWeight)
          .attr('transform', `rotate(180,${pointXRight},${pointYRight})`)
          .attr('transform', `rotate(${angle},${pointXRight},${pointYRight})`);

      //add spaces
      pointYLeft += dataFile.paddingLineSpaces + dataFile.paddingC;
      pointYRight += dataFile.paddingLineSpaces + dataFile.paddingC;

      //to start at the same y (height) again, the y of each side needs to be the max of both
      pointYLeft = Math.max(pointYLeft, pointYRight);
      pointYRight = Math.max(pointYLeft, pointYRight);

    })
  }


  /**
   * Function to draw the category names (on the right)
   * @param svg
   * @param dataCategory
   * @param dataFile
   */
  function drawCategoryNames(svg, dataCategory, dataFile) {

    //calculate the x coordinate for every text
    const posX = 0 - dataFile.gapBetweenPillars / 2 - dataFile.objectsColumnsPerCategory * dataFile.paddingC - dataFile.categoryStatusDeltaX;
    let posY = 0;

    //iterate over all categories
    dataCategory.forEach((data) => {

      //calculate maximum height of both sides of category
      let maxHeightOfCategory = Math.max(data.blockLeftHeight, data.blockRightHeight);

      //set the relative position (bottom(0) is default)
      let relativeYPositionInEachCategory = 0;
      //if position is middle
      if (dataFile.categoryStatusPos === 'middle') {
        //add half of the maximal height of both values
        relativeYPositionInEachCategory = maxHeightOfCategory / 2;
      }

      //add the relative position to the absolute
      posY += relativeYPositionInEachCategory;

      //append text
      svg.append('text').text(data.name)
          .attr('class', 'sym sym-' + data.color)
          .attr("x", posX)
          .attr("y", posY)
          .attr("alignment-baseline", "middle")
          .attr('font-family', dataFile.defaultFontFamily)
          .attr('font-size', dataFile.defaultFontH2)
          .attr('font-weight', dataFile.defaultFontWeight)
          //needs to be rotated because the surrounding g is rotated by 180
          .attr('transform', `rotate(${180 + dataFile.categoryStatusRotation},${posX},${posY})`);

      //preparation for next iteration *************************
      //add spaces
      posY += dataFile.paddingLineSpaces + dataFile.paddingC;

      //adjust absolute posY according to relative position
      //add the max height if position is bottom or half if its middle
      if (dataFile.categoryStatusPos === 'middle') {
        //add half of the maximal height of both values
        posY += maxHeightOfCategory / 2;
      } else {
        posY += maxHeightOfCategory;
      }
    })
  }


  /**
   * Function to draw the names of the pillars
   * @param svg
   * @param dataFile
   */
  function drawPillarNames(svg, dataFile) {

    //y offset according to symbol gap
    const posY = dataFile.paddingC * -2.5;
    //x coordinate of center under pillar
    const posX = (dataFile.gapBetweenPillars + (dataFile.objectsColumnsPerCategory - 1) * dataFile.paddingC) / 2;

    //append left label
    svg.append('text').text(dataFile.categoryType1)
        .attr("x", posX)
        .attr("y", posY)
        .attr('font-family', dataFile.defaultFontFamily)
        .attr('font-size', dataFile.defaultFontH2)
        .style("text-anchor", 'middle')
        .style("color", "black")
        //needs to be rotated because the surrounding g is rotated by 180
        .attr('transform', `rotate(180,${posX},${posY})`);

    //append right label
    svg.append('text').text(dataFile.categoryType2)
        .attr("x", -posX)
        .attr("y", posY)
        .attr('font-family', dataFile.defaultFontFamily)
        .attr('font-size', dataFile.defaultFontH2)
        .style("text-anchor", 'middle')
        .style("color", "black")
        //needs to be rotated because the surrounding g is rotated by 180
        .attr('transform', `rotate(180,${-posX},${posY})`);
  }


  /**
   * Function to generate blocks coordinates for symbols
   * @param numberOfSymbols
   * @param symbolGap       gap between symbols (x and y)
   * @param numberOfColumns
   * @param numberOfSymbolsPerGroup
   * @param gapBetweenGroups
   * @param direction       direction to generate coordinates (r2l: from right to left; l2r: from left to right)
   * @returns {Array}
   */
  function getBlock(numberOfSymbols, symbolGap, numberOfColumns, numberOfSymbolsPerGroup, gapBetweenGroups, direction) {

    let coordinates = [];

    //iterate over number of symbols
    for (let i = 0; i < numberOfSymbols; i++) {
      //calc x coordinate
      let x = (i % numberOfColumns) * symbolGap;
      //if l2r change sign
      if (direction === 'l2r') {
        x = -x;
      }

      //calc y coordinate
      let y = Math.floor(i / numberOfColumns) * symbolGap;
      //add group gap if necessary
      if (i >= numberOfSymbolsPerGroup) {
        y += gapBetweenGroups;
      }

      coordinates.push({x: x, y: y});
    }

    return coordinates;
  }
}