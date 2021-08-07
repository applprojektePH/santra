
/**
 * main start function
 */
let storyNode;
function mainStart(query) {
storyNode = query.story;
	// if page is called from back and front button in browser
	window.onpopstate = function(event) {
		location.reload();
	};
	switch (false) {
		case (query.start  === undefined):
			// console.log('start');
			createStartPage(false);
			break;
		case (query.story  === undefined):
			createStoryPage(query.story, true);
			break;
		case (query.topic  === undefined):
			// console.log('story');
			createTopicPage(query.topic, true);
			break;
		case (query.list  === undefined):
			// console.log('list');
			createListPage(query.list, false);
			break;
	}

}

