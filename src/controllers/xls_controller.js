let xlsx = require('xlsx');

let CONSTANTS = require("../libs/constants");
let db = require('../libs/db');
let UTILS = require('../libs/utils');

let nodeResult, projectResult;


module.exports = function(models){
  let page = {
    title:"",
    values: [],
    libs: [],
    styles: []
  };

  //truncate all edge and vertex classes in constants.js
  this.truncateAll = function(req, res, next) {

    let classes = [];

    for(clazz in CONSTANTS.CLASSES.EDGES) {
      db.truncate(CONSTANTS.CLASSES.EDGES[clazz]);
    }

    for(clazz in CONSTANTS.CLASSES.VERTICES) {
      db.truncate(CONSTANTS.CLASSES.VERTICES[clazz]);

    }
    res.locals.printOut = "truncated everything";
    next();
  }

  this.printOut = function(req, res, next) {
    res.send(res.locals.printOut);
  }

  this.truncateNodes = function(req, res, next) {
    let file;
    try {
      console.log(req.params.fileName);
      file = xlsx.readFile("./src/public/upload/"+req.params.fileName+".xlsx");
    } catch(e) {
       res.send("no file 'received'");
    }

    let sheet_name_list = file.SheetNames;

    console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++ reading Update +++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");


    let nodes = xlsx.utils.sheet_to_json(file.Sheets[sheet_name_list[0]]);

    let truncateNodesList = [],
    errorList = [];

    Promise.all(nodes.map(async function(truncateNode) {
      let truncateObject = {
        "id":truncateNode.ID,
        "version": String(truncateNode.ID) + "-" + String(truncateNode.referenceYearS),
      };

      if(!UTILS.listContainsObject(truncateObject, truncateNodesList, "id")) {
        truncateNodesList.push(truncateObject, "id");
        console.log("--------------- deleting node "+truncateObject.id+" -----------------");
        var del = await db.delNode(truncateObject);
        console.log("deleted: "+truncateObject.id);
      }

      })).then(function () {
        console.log("nodes from db deleted: "+ JSON.stringify(truncateNodesList));
        console.log("errorList duplicates: "+JSON.stringify(errorList));
        res.locals.printOut = "truncated nodes ";
        next();
      });
  }

  this.read = function(req, res, next) {
    let file;

    try {
      console.log(req.params.fileName);
      file = xlsx.readFile("./src/public/upload/"+req.params.fileName+".xlsx");
    } catch(e) {
       res.send("no file 'received'");
    }


    let sheet_name_list = file.SheetNames;

    page.title = "xls reading";

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++ new try ++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    page.title += " successful";

    let nodes = xlsx.utils.sheet_to_json(file.Sheets[sheet_name_list[0]]);

    // import lists
    let importNodesList = [],
    importProjectsList = [],
    importInstitutesList = [],
    importDatasourcesList = [],
    importContactsList = [],
    importContentsList = [],
    importTagsList = [],

    errorList = [],
    dbErrorList = [],
    connections = {}
    ;

    nodes.forEach(function(importNode, index, array) {

        // build complex importobjects
        let importObject = {
            //NODE properties
            "id":importNode.ID,
            "topic": importNode.topic.trim(),
            "story":importNode.story.trim(),
            "title":importNode.title.trim(),
            "rank":importNode.rank.trim(),
            "color":importNode.color.trim(),
            "colorTopic":importNode.colorTopic.trim(),
            "storyStart":importNode.storyStart.trim(),
            "storyEnd":importNode.storyEnd.trim(),

        };
        //prevent duplicates
        if(!UTILS.listContainsObject(importObject, importNodesList, "id"))
            importNodesList.push(importObject);
        else {
            errorList.push(importObject);
            console.error("duplicate");
            return;
        }

        let contentObject = {
            "version": String(importNode.ID) + "-" + String(importNode.referenceYearS),
            "text":(importNode.text != undefined ? importNode.text.replace(/[\r]/g,"<br>") : ""),
            "comment":(importNode.comment != undefined ? importNode.comment.replace(/[\r]/g,"<br>") : ""),
            "vizContent":importNode.vizContent,
            "dynamic":importNode.dynamic,
            "referenceYearS": (importNode.referenceYearS != undefined ? importNode.referenceYear : ""),
            "vizOptions": (importNode.vizOptions != undefined ? importNode.vizOptions : "default"),
            "format": (importNode.format != undefined ? importNode.format : "default"),
        };

        if(!UTILS.listContainsObject(contentObject, importContentsList, "version"))
            importContentsList.push(contentObject);
        else {
            errorList.push(contentObject);
            console.error("duplicate");
            return;
        }

        let project = {
            "title":(importNode.projectSource != undefined ? importNode.projectSource.trim() : undefined ),
            "projectInfo": (importNode.projectInfo != undefined ? importNode.projectInfo.trim() : undefined )
        };
        if(!UTILS.listContainsObject(project, importProjectsList, "title")) {
            importProjectsList.push(project);
        }

        let contact = {"name": (importNode.contact != undefined ? importNode.contact.trim() : undefined)};
        if(!UTILS.listContainsObject(contact, importContactsList, "name")) {
            importContactsList.push(contact);
        }

        let institutes = [];

        if(importNode.institutes != "" && importNode.institutes != undefined) {
            importNode.institutes.split(";").forEach(function(insti) {
                let institute = {"name":insti.trim()};
                if(!UTILS.listContainsObject(institute, institutes, "name")) {
                    importInstitutesList.push(institute);
                    institutes.push(institute);
                }
            });
        }

        let datasources = [];

        if(importNode.dataSource != "" && importNode.dataSource != undefined) {
            importNode.dataSource.split(";").forEach(function(ds) {
                let datasource = {"source": ds.trim()};
                if(!UTILS.listContainsObject(datasource, datasources, "source")) {
                    importDatasourcesList.push(datasource);
                    datasources.push(datasource);
                }
            });
        }

        let tags = [];

        if(importNode.tags != "" && importNode.tags != undefined) {
            importNode.tags.split(";").forEach(function(tag) {
                let tagReal = {"value": tag.trim()};
                if(!UTILS.listContainsObject(tagReal, tags, "value")) {
                    importTagsList.push(tagReal);
                    tags.push(tagReal);
                }
            });
        }

        //////EDGES INFORMATION read in
        connections[importObject.id] = {"previous":importNode.prevID,"after":importNode.afterID,"related":importNode.related != undefined ? importNode.related.split(";").map(item => item.trim()) : [], "proposed":importNode.proposed != undefined ? importNode.proposed.split(";").map(item => item.trim()) : []};

        // INSERT object into db

        setTimeout(function(){

            console.log("--------------- new node -----------------");
            //with db.insert nodeObject, contentObject, projectObject, datasourceObject, tagObject, contactObject, instituteObject
            db.insert(importObject, contentObject, project, datasources, tags, contact, institutes)
                .done(function(result) {
                    //console.log(importObject);

                    if(array.length-1 == index) {
                        return new Promise(resolve => {
                            db.insertConnections(connections);
                            resolve();
                        }).then(
                        res.render('xls', {
                            page: page
                        }));
                    }
                });

        }, index*200);
    });

    //end of import -> print to page
    page.values.nodes = importNodesList;
    page.values.content = importContentsList;
    page.values.projects = importProjectsList;
    page.values.institutes = importInstitutesList;
    page.values.contact = importContactsList;
    page.values.datasources = importDatasourcesList;
    page.values.tags = importTagsList;

    page.values.xlserrors = errorList;
    page.values.dberrors = [];

  }

  this.update = async function(req, res, next) {
    const reconnection = await db.reconnectContent();
    const truncatedEdgeless = await db.delEdgeless();
    //console.log("edgeless vertices deleted: "+truncatedEdgeless);
    res.locals.printOut = "updated vertices";
    next();
  }

}