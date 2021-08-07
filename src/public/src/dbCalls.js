/**
 * [description]
 * @project AltersAtlas
 * @author Philipp Meyer <philipp.meyer@fhnw.ch>
 * @date 13.09.2017
 * @version 1.0
 */


function getAllNodes(callback) {

    $.getJSON('./getAllNodes', function (data) {
        callback(data.sort(compareNodes));
    });
}

function compareNodes(a, b) {
    return a.nodeID - b.nodeID;
}

function getGraph(callback) {
    $.getJSON('./getGraph/', function (data) {
        callback(data);
    });
}

function getThemes(callback) {
    $.getJSON('./getThemes/', function (data) {
        callback(data);
    });
}

function getRandomNode(callback) {

    getAllNodes(data => {
        callback(data[Math.round(Math.random() * data.length)]);
    });

}

function getNode(id, callback) {
    $.getJSON('./getNode/' + id, function (data, error) {
        callback(data);
    });
}


function getAllTags(callback) {

    $.getJSON('./getAllTags', function (data) {
        let tags = [];
        data.map(entry => {
            tags.push(entry.value);
        });
        callback(tags.sort(stringComparison));
    });
}

function getNodesByTag(tag, callback) {
    $.getJSON('./getNodesByTag/' + tag, function (data, error) {
        callback(data);
    });
}

function searchNodes(searchString, callback) {
    $.getJSON('./searchNodes/' + searchString, function (data) {
        let result = [];
        data.map(entry => {
            result.push({
                nodeID: entry.id,
                title: entry.title,
            });
        });
        callback(result);
    });
}

function getJSONList(topic, callback) {
    d3.queue()
        .defer(d3.json, `./static/data/${topic.toLowerCase()}.json`)
        .await(function (error, data) {
            callback(data);
        });

}


function stringComparison(a, b) {
    return a.localeCompare(b, 'de-CH');

}