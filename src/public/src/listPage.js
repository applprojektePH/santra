


$('.linkText').click(function(){
$('this').text();

})
function updateList(topic, data, newState=true) {


  $('#mainCanvas').css('height', 'auto');
  $('html, body').animate({scrollTop:0, scrollLeft:0}, 0);

	let html = '';
	let urlSuffix = topic;

  if (topic.substring(0, 5) === 'Suche') {
		document.title = "AltersAtlas - Suche";
		html = `<h2>Suchergebnis für: ${topic.substring(6)}</h2>`;
		urlSuffix = `Suche:${topic.substring(6)}`;
	} else if (topic.substring(0, 3) === 'tag') {
    let shortTopic = topic.substring(3);
    shortTopic= shortTopic.replace('%2b', '+');
    document.title = "AltersAtlas - " + shortTopic;
    html = `<h2>${shortTopic}</h2>`;
  } else {
		document.title = "AltersAtlas - " + topic;
		html = `<h2>${topic}</h2>`;

	}

	if (newState) {
		history.pushState({}, "", `AA?list=${urlSuffix}`);
	}

  if (topic === 'Tags') {
		html += `<table id="tagsTable"><tr>`;
		let dataLength = data.length;
		let numberOfColumns = 3;
		let numberOfElementsPerColumn = Math.ceil(dataLength / numberOfColumns);
		for (let i = 0; i < dataLength; i++) {
      if (i%numberOfColumns === 0) {
        html += '</tr><tr>';
      }

      html += `<td><a class="linkText" href="javascript:updateListByTag('${data[i]}')">${data[i]}</a></td>`;

		}
		html += '</tr></table>';
	} else if (topic === 'Lebenslagen'){
		let lastElement = data[data.length - 1];
		html += `<img id="lebenslageImage" src="static/data/${lastElement.img}"/>`;
		html += `${lastElement.desc}`;
		html += `<ol id="llList">`;
		for (let i = 0; i < data.length-1; i++) {
			html += `<li><a class="linkText" href="javascript:createStoryPage(${data[i].nodeID})">${data[i].title}</a></li>`;
		}
		html += '</ol>';
		lastElement.literature.map((author) => {
			html += '<p class="literature">' + author + '</p>';
		});
  } else if (topic === 'Impressum'){
	  let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      html += `<h3>${keys[i]}</h3>`;
      for (let j = 0; j < data[keys[i]].length; j++) {
        if (data[keys[i]][j] === 'email') {
          html += `<span onclick="feedback('')" style="cursor: pointer; text-decoration: underline;">`;
          html += '<span>altersatlas</span>';
          html +=  '<span class="displayNone">text</span>';
          html +=  '<span>[at]</span>';
          html +=  '<span class="displayNone">text</span>';
          html +=  '<span>fhnw.ch</span></span><br>';
        } else {
          html += `<span>${data[keys[i]][j]}</span><br>`;
        }
      }
    }
  } else  if (topic.substring(0,3) ==="tag") {
      html += `<ol>`;
      for (let i = 0; i < data.length; i++) {
        html += `<li><a class="linkText" href="javascript:createStoryPage(${data[i].id})">${data[i].title}</a></li>`;
      }
      html += '</ol>';
  } else  if ($.isEmptyObject(data)) {
    html += `<span>Keine Suchergebnisse!</span>`
  } else {
		html += `<ol>`;
		for (let i = 0; i < data.length; i++) {
      if (data[i].nodeID === undefined) {
        html += `<li><a class="linkText" href="javascript:createStoryPage(${data[i].id})">${data[i].title}</a></li>`;
      } else {
        html += `<li><a class="linkText" href="javascript:createStoryPage(${data[i].nodeID})">${data[i].title}</a></li>`;
      }
    }
		html += '</ol>';
	}


	html += '</div>';

	$('#listContainer').html(html);
	$('#listContainer').css('opacity', 1);


}

function updateListByTag(tag, newState) {
	var tagplus= tag.replace('+', '%2b');
	getNodesByTag(tag, data => {
    updateList("tag"+tagplus, data, newState);
	})

}

function updateListBySearch(start=false) {

	if (start) {
		let searchString = $('#searchInput').val();

		if (searchString !== '') {
			moveCategories(d3.select("#canvasSVG"));

			setTimeout(function () {
				createListPage('Suche:'+searchString);
			}, 2200);
		}
	} else {
		let searchString = $('#searchInputNav').val();

		if (searchString !== '') {
			createListPage('Suche:'+searchString);
		}
	}


}