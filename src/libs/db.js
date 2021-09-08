 let q     = require('q');
// let OrientJs = require('orientjs');
//
 let CONSTANTS = require("../libs/constants");
 let UTILS = require("../libs/utils");
 const mysql = require('mysql');
// let orientDb = OrientJs({
//   host: CONSTANTS.SETTINGS.DB.HOST,
//   port: CONSTANTS.SETTINGS.DB.PORT
// }).use({
//   name: CONSTANTS.SETTINGS.GRAPH.NAME,
//   username: CONSTANTS.SETTINGS.DB.USERNAME,
//   password: CONSTANTS.SETTINGS.DB.PASSWORD
// });
//
 //const mysql = require('mysql');
 const pool  = mysql.createPool({
     connectionLimit : 10,
     host            : 'localhost',
     user            : 'admin',
     password        : 'mysecretpassword',
     database        : 'santra'
 })
 module.exports = {
    getOrders: function (res){
            pool.getConnection((err, connection) => {
                if(err) throw err
                console.log('connected as id ' + connection.threadId)
                connection.query('SELECT * FROM software WHERE userid IN \n' +
                    '(SELECT id FROM users)', (err, rows) => {
                    connection.release() // return the connection to pool
                    if (!err) {
                        var personList = [];
                        for (var i = 0; i < rows.length; i++) {
                            // Create an object to save current row's data
                            var person = {
                                'orderid': rows[i].orderid,
                                'institut': rows[i].institut,
                                'professur': rows[i].professur
                            }
                            // Add object into array
                            personList.push(person);
                            res.send(JSON.stringify(rows))

                        }
                    } else {
                        console.log(err)
                    }
                })
            })
    }
 }

  //user queries
//   getTest: function (res) {
//     orientDb.select("id as nodeID,title,@rid").from(CONSTANTS.CLASSES.VERTICES.NODES).all().then(function(list) {
//       res.send(JSON.stringify(list));
//     });
//   },
//   getAllNodes: function (res) {
//     orientDb.select("id as nodeID,title,@rid").from(CONSTANTS.CLASSES.VERTICES.NODES).all().then(function(list) {
//       res.send(JSON.stringify(list));
//     });
//   },
//     getGraph: function(res) {
//         var linkCall = orientDb.query("select expand($d) let $a = (select id, out('"+CONSTANTS.CLASSES.EDGES.HAS_AFTER+"') as story from "+CONSTANTS.CLASSES.VERTICES.NODES+"), $b = ( select id, out('"+CONSTANTS.CLASSES.EDGES.RELATED+"') as related from "+CONSTANTS.CLASSES.VERTICES.NODES+"), $c = (select id, out('"+CONSTANTS.CLASSES.EDGES.PROPOSED+"') as proposed from "+CONSTANTS.CLASSES.VERTICES.NODES+"), $d = unionall( $a, $b, $c )", {fetchPlan: '*:1'}).all();
//         var allNodesCall = orientDb.select("id,color,title,start,rank,@rid").from(CONSTANTS.CLASSES.VERTICES.NODES).all();
//         q.allSettled([linkCall, allNodesCall]).then(result => {
//             returnObject = createGraphObject(result)
//             res.send(JSON.stringify(returnObject));
//         })
//     },
//
//   getThemes: function(res) {
//         var whereObj = {"storyStart":"T"}
//         var storyCall = orientDb.select('id, title, story, topic, color, colorTopic').from(CONSTANTS.CLASSES.VERTICES.NODES).where(whereObj).all();
//         var topicCall = orientDb.select('distinct(topic)').from(CONSTANTS.CLASSES.VERTICES.NODES).all();
//         q.allSettled([storyCall, topicCall]).then(result => {
//             returnObject = createThemesTree(result);
//             res.send(JSON.stringify(returnObject));
//         })
//     },
//   getRandomNode: function (res) {
//     orientDb.select("* as nodeID").from(CONSTANTS.CLASSES.VERTICES.NODES).all().then(function(list) {
//       res.send(JSON.stringify(list[Math.round(list.length*Math.random())]));
//     });
//   },
//
//   getNode: function (id, res) { //(traverse out() from (select from room where name="room test 1"))
//
//     if(isNaN(id)) {
//       console.log("not number");
//       res.send({});
//       return;
//     }
//     console.log(new Date().toLocaleString() + " - id: "+id);
//     var whereObj = {};
//     whereObj["id"] = id;
//     var nodeCall = orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).where({"id":id}).all();
//
//       var projectCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_PROJECT+"')) from (select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTENT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//       var contactCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTACT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//       var instituteCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_INSTITUTE+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//       var datasourceCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_DATASOURCE+"')) from (select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTENT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     var previousCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var afterCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_AFTER+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var relatedCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.RELATED+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var proposedCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.PROPOSED+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var contentCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTENT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var previousNodesCall = orientDb.query("traverse out('"+CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS+"')" +
//         "from (select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     var afterNodesCall = orientDb.query("traverse out('"+CONSTANTS.CLASSES.EDGES.HAS_AFTER+"')" +
//         "from (select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     var storyCall = orientDb.query("traverse out('"+CONSTANTS.CLASSES.EDGES.HAS_AFTER+"'), out('"+CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS+"')" +
//         "from (select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     q.allSettled([nodeCall, projectCall, contactCall, datasourceCall, previousCall, afterCall, relatedCall, instituteCall,
//       proposedCall, contentCall, previousNodesCall, afterNodesCall, storyCall]).then(result => {
//
//       createNodeObject(result).then((returnObject) => {
//         res.send(JSON.stringify(returnObject));
//       });
//
//     });
//   },
//
//   getNodeContent: function (id, res) {
//     //(traverse out() from (select from room where name="room test 1"))
//
//     if(isNaN(id)) {
//       console.log("not number");
//       return;
//     }
//     var whereObj = {};
//     whereObj["id"] = id;
//     var nodeCall = orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).where({"id":id}).all();
//
//     var projectCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_PROJECT+"')) from (select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTENT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     var contactCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTACT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var instituteCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_INSTITUTE+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var datasourceCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_DATASOURCE+"')) from (select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTENT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     var previousCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var afterCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_AFTER+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var relatedCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.RELATED+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var proposedCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.PROPOSED+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var contentCall = orientDb.query("select expand(out('"+CONSTANTS.CLASSES.EDGES.HAS_CONTENT+"')) from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id", { params : whereObj }).all();
//
//     var previousNodesCall = orientDb.query("traverse out('"+CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS+"')" +
//         "from (select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     var afterNodesCall = orientDb.query("traverse out('"+CONSTANTS.CLASSES.EDGES.HAS_AFTER+"')" +
//         "from (select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     var storyCall = orientDb.query("traverse out('"+CONSTANTS.CLASSES.EDGES.HAS_AFTER+"'), out('"+CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS+"')" +
//         "from (select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id)", { params : whereObj }).all();
//
//     q.allSettled([nodeCall, projectCall, contactCall, datasourceCall, previousCall, afterCall, relatedCall, instituteCall,
//       proposedCall, contentCall, previousNodesCall, afterNodesCall, storyCall])
//         .then(result => {
//       createNodeObject(result)
//           .then((returnObject) => {
//             res.end(JSON.stringify(returnObject));
//           });
//     });
//
//   },
//
//   getAllTags: function (res) {
//     orientDb.select("*").from(CONSTANTS.CLASSES.VERTICES.TAGS).all().then(function(list) {
//       res.send(JSON.stringify(list));
//     });
//   },
//
//   //Hier muss man dann vor Wiederinbetriebnahme noch schauen, ob man die Abfragen anders anlegen kann
//   /*getNodesByTag: function (tag, res) {
//
//     var regexp = /^[a-zA-Z0-9\s\+\-\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]*$/;
//
//     if (!regexp.test(tag)) {
//       console.log("not allowed string");
//       res.send([]);
//       return;
//     }
//
//     orientDb.query("select expand(in('"+CONSTANTS.CLASSES.EDGES.HAS_TAG+"')) from tags where value.toLowerCase() = '"+tag.toLowerCase()+"'").all().then(function(list) {
//       res.send(JSON.stringify(list));
//     });
//   },*/
//
//   //Hier muss man dann vor Wiederinbetriebnahme noch schauen, ob man die Abfragen anders anlegen kann
//   /*searchNodes: function (searchString, res) {
//
//     var regexp = /^[a-zA-Z0-9\s\+\-\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]*$/;
//
//     if (!regexp.test(searchString)) {
//       console.log("not allowed string");
//       res.send([]);
//       return;
//     }
//
//     // author datasource
//     console.log("searchstring: "+searchString);
//
//     var nodeCall = orientDb.query("select * from nodes where title.toLowerCase() like '%"+searchString.toLowerCase()+"%' OR "+
//         "text.toLowerCase() like '%"+searchString.toLowerCase()+"%' OR "+
//         "comment.toLowerCase() like '%"+searchString.toLowerCase()+"%'"
//     ).all();
//
//     var authorCall = orientDb.query("select expand(in(hasProject)) from (select expand(in(hasContact)) from persons where name.toLowerCase() like '%"+searchString.toLowerCase()+"%')").all();
//
//     var datasourceCall = orientDb.query("select expand(IN(hasDatasource)) from datasources where title.toLowerCase() like '%"+searchString.toLowerCase()+"%'").all();
//
//     q.allSettled([nodeCall, authorCall, datasourceCall]).then(results => {
//
//       var array = [];
//
//       results.map(selected => {
//
//         if(selected.value.length > 0) {
//
//           array = array.concat(
//               selected.value.map(node => {
//                 //console.log(node.id);
//                 return node;
//               })
//           );
//         }
//       });
//
//       var resList = [];
//
//       array.forEach(node => {
//         if(!UTILS.listContainsObject(node, resList, "id")) {
//           //console.log("-- "+node.id);
//           resList.push(node);
//         }
//
//       });
//
//       res.send(JSON.stringify(resList));
//     });
//   },*/
//
// /////////////////////db transactions//////////////////////////////////
//
//   //delete a node with all its edges
//   delNode: async function (truncateObject) {
//     var whereID = {};
//     whereID["id"]= truncateObject["id"];
//     var whereVersion = {};
//     whereVersion["version"]= truncateObject["version"];
//     var nodedel = orientDb.delete('VERTEX').from(CONSTANTS.CLASSES.VERTICES.NODES).where(whereID).one()
//     var contentdel = orientDb.delete('VERTEX').from(CONSTANTS.CLASSES.VERTICES.CONTENT).where(whereVersion).one()
//
//     return q.allSettled([nodedel, ]).then(function(results) {
//       return(results)
//     });
//   },
//
//   //reconnect content to updated nodes after insert
//   reconnectContent: function () {
//       console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");
//       console.log("++++++++++++++++++++++++++ starting reconnection of content +++++++++++++++++++++++");
//       console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");
//       return new Promise(resolve => {
//         edgelessContent = orientDb.select().from(CONSTANTS.CLASSES.VERTICES.CONTENT).where('in().size() = 0').all();
//         resolve(edgelessContent);
//       }).then(function(edgelessContent) {
//         if (edgelessContent.length > 0) {
//           //console.log("found unconnected content: "+edgelessContent.length);
//           console.log("found unconnected content: ");
//           var newNodes = [];
//           return Promise.all(edgelessContent.map(function(elCont) {
//               var whereID = {};
//               whereID["id"] = +elCont.version.split("-")[0];
//               console.log("this is node id of unconnected content "+JSON.stringify(whereID));
//               return new Promise(resolve => {
//                 var newNode = orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).where(whereID).one();
//                 resolve(newNode);
//               }).then(async function(newNode) {
//                 newNodes.push(newNode.id);
//                 const newEdge = await addEdge(CONSTANTS.CLASSES.EDGES.HAS_CONTENT, newNode, elCont);
//           })})).then(function() {
//                 //console.log("and connected to "+JSON.stringify(newNodes));
//                 console.log("reconnection done");
//           });
//         }
//         else{
//           console.log("no unconnected Content found")
//           return;
//         }
//
//       });
//   },
//
//   //delete edgeless vertices after update of nodes
//   delEdgeless: async function () {
//     console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");
//     console.log("++++++++++++++++++++++++++++ deleting edgeless vertices  +++++++++++++++++++++++++++");
//     console.log("++++++++++++++++++++++++++++++++++++         ++++++++++++++++++++++++++++++++++++++");
//     const edgelessList = await orientDb.select().from(CONSTANTS.CLASSES.VERTICES.VERTICES).where('in().size() = 0').all();
//     //console.log("deleting "+edgelessList.length+" edgeless vertices");
//     console.log("deleting edgeless vertices");
//     var del =  await orientDb.delete('VERTEX').from(CONSTANTS.CLASSES.VERTICES.VERTICES).where('in().size() = 0').all();
//     return(del);
//   },
//
//   //insert nodeObject with properties and links to project, datasource, tags, contact and institutes
//   insert: function (nodeObject, contentObject, projectObject, datasourceObject, tagObject, contactObject, instituteObject) {
//
//     //function uses clazz, object, id
//     var nodeCall =  nodeObjectCall(CONSTANTS.CLASSES.VERTICES.NODES, nodeObject, "id");
//     var contentCall = singleObjectCall(CONSTANTS.CLASSES.VERTICES.CONTENT, contentObject, "version");
//     var projectCall =  singleObjectCall(CONSTANTS.CLASSES.VERTICES.PROJECTS, projectObject, "title");
//     var contactCall =  singleObjectCall(CONSTANTS.CLASSES.VERTICES.CONTACT, contactObject, "name");
//
//     var dsPromises = datasourceObject.map(async function(ds) {
//       const dsResponse = await singleObjectCall(CONSTANTS.CLASSES.VERTICES.DATASOURCES, ds, "source");
//       return dsResponse});
//     var dsCalls = Promise.all(dsPromises);
//
//     var instPromises = instituteObject.map(async function(institute) {
//           const instResponse = await singleObjectCall(CONSTANTS.CLASSES.VERTICES.INSTITUTES, institute, "name");
//           return instResponse});
//     var instCalls = Promise.all(instPromises);
//
//     var tagPromises = tagObject.map(async function(tagResult) {
//           const tagResponse = await singleObjectCall(CONSTANTS.CLASSES.VERTICES.TAGS, tagResult, "value");
//           return tagResponse
//           });
//     var tagCalls = Promise.all(tagPromises);
//
//
//     return q.allSettled([nodeCall, contentCall,  projectCall, contactCall, dsCalls, instCalls, tagCalls]).then(function(results) {
//
//
//       console.log("connecting major stuff");
//
//       var nodeResult = results[0].value;
//       var contentResult = results[1].value;
//       var projectResult = results[2].value;
//       var contactResult = results[3].value;
//       var datasourceResult = results[4].value;
//       var instResult = results[5].value;
//       var tagResult = results[6].value;
//
//       if(contactResult != undefined) {
//        addEdge(CONSTANTS.CLASSES.EDGES.HAS_CONTACT, nodeResult, contactResult);
//       }
//       if(contentResult != undefined) {
//        addEdge(CONSTANTS.CLASSES.EDGES.HAS_CONTENT, nodeResult, contentResult);
//      }
//       if(projectResult != undefined) {
//          addEdge(CONSTANTS.CLASSES.EDGES.HAS_PROJECT, contentResult, projectResult);
//       };
//       datasourceResult.map(function(ds) {
//         if(ds != undefined) {
//           addEdge(CONSTANTS.CLASSES.EDGES.HAS_DATASOURCE, contentResult, ds);
//         }
//       });
//       instResult.map(function(inst) {
//         if(inst != undefined) {
//           addEdge(CONSTANTS.CLASSES.EDGES.HAS_INSTITUTE, nodeResult, inst);
//         }
//       });
//       tagResult.map(function(tg) {
//         if(tg != undefined) {
//           addEdge(CONSTANTS.CLASSES.EDGES.HAS_TAG, nodeResult, tg);
//         }
//       });
//
//
//       console.log("connected major stuff");
//       return 1;
//     });
//   },
//
//   insertConnections: function (connections) {
//     console.log("----------------- connecting stories -------------------------------");
//
//     for(key in connections) {
//       var connection = connections[key];
//
//       // Select the newly inserted node
//       var nodeCall = orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).where({id:key}).one().then(function(nodesResult) {
//         return nodesResult;
//       });
//
//       // Select the node after the newly inserted node
//       var afterCall = orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).where({id: connection.after}).one().then(function(after) {
//         return after;
//       });
//
//       //Select the node before the newly inserted node
//       var beforeCall = orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).where({id: connection.previous}).one().then(function(previous) {
//         return previous;
//       });
//
//       //Select all nodes related to the newly inserted node
//       var relatedCall = orientDb.query("select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id in ["+connection.related+"]").all().then(function(related) {
//         return related;
//       });
//
//       //Select all nodes proposed from newly inserted node
//       var proposedCall = orientDb.query("select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id in ["+connection.proposed+"]").all().then(function(proposed) {
//         return proposed;
//       });
//
//       q.allSettled([nodeCall, beforeCall, afterCall, relatedCall, proposedCall]).then(function(results) {
//
//         var nodeResult = results[0].value;
//         var beforeResult = results[1].value;
//         var afterResult = results[2].value;
//         var relatedResult = results[3].value;
//         var proposedResult = results[4].value;
//
//         //create all the connections between the selected nodes
//         beforePromise = new Promise(resolve => {
//           if(beforeResult != undefined) {
//             addEdge(CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS, nodeResult, beforeResult);
//             addEdge(CONSTANTS.CLASSES.EDGES.HAS_AFTER, beforeResult, nodeResult);
//           }
//           resolve();
//         });
//
//         afterPromise = new Promise(resolve => {
//           if(afterResult != undefined) {
//             addEdge(CONSTANTS.CLASSES.EDGES.HAS_AFTER, nodeResult, afterResult);
//             addEdge(CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS, afterResult, nodeResult);
//           }
//           resolve();
//         });
//
//         betweenPromise = new Promise(resolve => {
//           if(afterResult != undefined && beforeResult != undefined) {
//             deleteEdge(CONSTANTS.CLASSES.EDGES.HAS_PREVIOUS, afterResult, beforeResult);
//             deleteEdge(CONSTANTS.CLASSES.EDGES.HAS_AFTER, beforeResult, afterResult);
//           }
//           resolve();
//         });
//
//         relatedPromise = new Promise(resolve => {
//           if(relatedResult != undefined) {
//             for(var cnt = 0; cnt < relatedResult.length; cnt++ ) {
//               addEdge(CONSTANTS.CLASSES.EDGES.RELATED, nodeResult, relatedResult[cnt]);
//             }
//           }
//           else {console.log("no related")}
//           resolve();
//         });
//
//         proposedPromise = new Promise(resolve => {
//           if(proposedResult != undefined) {
//             for(var cnt = 0; cnt < proposedResult.length; cnt++ ) {
//               addEdge(CONSTANTS.CLASSES.EDGES.PROPOSED, nodeResult, proposedResult[cnt]);
//               addEdge(CONSTANTS.CLASSES.EDGES.PROPOSED, proposedResult[cnt], nodeResult);
//             }
//           }
//
//           else {console.log("no proposed")}
//
//           resolve();
//         });
//         Promise.all([beforePromise, afterPromise, betweenPromise, relatedPromise, proposedPromise]).then(
//             console.log("inserted connections into db"));
//
//       });
//     }
//   },
//
//   clazzContains: function(clazz, whereClause) {
//     return orientDb.select().from(clazz).where(whereClause).all();
//   },
//
//   dbClassInsert: function(clazz, importKeyValuePairs) {
//     return orientDb.insert().into(clazz).set(importKeyValuePairs).one().then(function(player){
//       console.log("success")
//       return player;
//     });
//   },
//
//   truncate: function(clazz) {
//     orientDb.query("truncate class "+clazz+" unsafe")
//         .then(
//             function(del){
//               console.log('Records Deleted');
//             }
//         );
//   }
//
// };
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////help functions for inserting new node data//////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// function singleObjectCall(clazz, object, id) {
//   var strout = clazz;
//
//   if (object == undefined) {
//     console.log(strout + "is undefined for this node")
//   }
//   else {
//     var whereObj = {};
//     whereObj[id] = object[id];
//
//     return new Promise(resolve => {
//       result = orientDb.select().from(clazz).where(whereObj).one();
//       resolve(result);
//     }).then(function(result) {
//
//       if(result == undefined) {
//         strout += " '"+ object[id] +"'";
//         console.log("creating new "+strout);
//
//         return new Promise(resolve => {
//            result = orientDb.insert().into(clazz).set(object).one();
//            resolve(result);});
//       }
//       else {
//           strout += " '"+ result[id]+"'";
//           console.log("existing "+strout);
//           return result;
//       }
//     })
//   };
// }
//
//
// function nodeObjectCall(clazz, object, id) {
//   var whereObj = {};
//   whereObj[id] = object[id];
//
//   return orientDb.select().from(clazz).where(whereObj).one().then(function(result) {
//
//     var strout = clazz;
//
//     if((result == undefined) && (object["rank"] === 'M')) {
//       strout += " '"+ object[id] +"'";
//       console.log("creating new main"+strout);
//       return orientDb
//           .insert()
//           .into(CONSTANTS.CLASSES.VERTICES.MAINNODES)
//           .set(object)
//           .one();
//     }
//     else if((result == undefined) && (object["rank"] === 'S')) {
//       strout += " '"+ object[id] +"'";
//       console.log("creating new sub"+strout);
//       return orientDb
//           .insert()
//           .into(CONSTANTS.CLASSES.VERTICES.SUBNODES)
//           .set(object)
//           .one();
//     }
//     else {
//       strout += " '"+ result[id]+"'";
//       console.log("existing"+strout);
//       return result;
//     }
//   });
// }
//
// function multiObjectReturnCall(clazz, clazzEdge, objectList, id, originNode) {
//
//   return orientDb.select().from(clazz).where(id+ " in ["+objectList.map(d => { return "'"+d[id]+"'";})+"]").all().then(function(results) {
//
//     var strout = clazz;
//
//
//       if(results.length > 0) {
//         results.forEach(d => {
//
//           objectList.splice(UTILS.arrayObjectIndexOf(objectList, d.title, "title"),1);
//
//           strout += "existing '"+clazz+": "+d[id]+"'\r\n";
//
//           addEdge(clazzEdge, originNode, d);
//         });
//       }
//
//       strout = strout.substr(0,strout.length-1);
//
//       if(objectList.length > 0) {
//         objectList.map(d => {
//             strout += "creating '"+clazz+": "+d[id]+"'\r\n";
//             return "('"+d+"')";
//         });
//       }
//
//       return objectList;
//     });
//
// }
//
// function addEdge(edgeName, originObject, targetObject) {
//   console.log("writing("+edgeName+"): ");
//   console.log(originObject["@rid"] +  " -> " +targetObject["@rid"]);
//
//   return new Promise(resolve => {
//     var edgeResult = orientDb.select().from(edgeName).where({"out": originObject["@rid"],"in": targetObject["@rid"]}).one();
//     resolve(edgeResult);
//   }).then(async function(edgeResult) {
//     if(edgeResult == undefined) {
//       const newEdge = await orientDb.create('edge', edgeName).from(originObject["@rid"]).to(targetObject["@rid"]).all();
//       console.log("created "+edgeName+"-edge "+ originObject["@rid"]+ " -> "+targetObject["@rid"]);
//     }
//     else {
//
//       console.log(edgeName + "-edge exists: "+ originObject["@rid"]+ " -> "+targetObject["@rid"]);
//     }
//   });
// }
//
// function deleteEdge(edgeName, originObject, targetObject) {
//   orientDb.select().from(edgeName).where({"out": originObject["@rid"],
//     "in": targetObject["@rid"]}).one().then(function(edgeResult) {
//     if(edgeResult != undefined) {
//       orientDb
//           .delete('edge', edgeName)
//           .from(originObject["@rid"])
//           .to(targetObject["@rid"])
//           .all()
//           .then(function(d) {
//             console.log("deleted "+edgeName+"-edge "+ originObject["@rid"]+ " -> "+targetObject["@rid"]);
//           });
//     } else {
//       console.log(edgeName + "-edge does not exist: "+ originObject["@rid"]+ " -> "+targetObject["@rid"]);
//     }
//   });
// }
// function createNodeArray (nodeArray) {
//     var returnArray = [];
//     if(nodeArray != undefined) {
//         nodeArray.forEach(d => {
//             returnArray.push({ 'id': d.id, 'cat': d.topic, 'story': d.story, 'color': d.color, 'title': d.title, 'rank': d.rank, 'start': d.storyStart, 'end': d.storyEnd});
//         });
//     }
//     return returnArray;
// }
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////help functions for user queries//////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////
//
// function createLinkArray (linkArray, nodeArray) {
//     var returnArray = [];
//     if(linkArray != undefined) {
//         linkArray.forEach(d => {
//             link_class = Object.keys(d)[2];
//             if(d[link_class].length != 0) {
//                 for (var i = 0; i < d[link_class].length; i++) {
//                     //console.log(d.id, d[link_class][i].id, link_class);
//                     returnArray.push({'source': d.id, 'target': d[link_class][i].id, 'link_class': link_class});
//                 }
//             }
//         });
//     }
//     //console.log(returnArray.length)
//     return returnArray;
// }
//
// function createGraphObject (result) {
//     returnObject = {
//         "nodes": createNodeArray(result[1].value),
//         "links": createLinkArray(result[0].value),
//     }
//     return returnObject;
// }
//
// //is used in nodeCall
// function createRelated(relatedArray) {
//   var returnArray = [];
//   if(relatedArray != undefined) {
//     relatedArray.forEach(d => {
//       returnArray.push({title: d.title, nodeID: d.id, color: d.color});
//     });
//   }
//
//   return returnArray;
// }
//
// //is used in nodeCall
// function createRelatedStory(storyArray, relation) {
//   var returnArray = [];
//   return Promise.all(storyArray.map(function(d) {
//     var promise = new Promise(resolve => {
//       var whereObj = {};
//       whereObj["id"] = d["id"];
//       nodeArray = orientDb.query("select id, story, color, title from (traverse out('"+relation+"')"+
//           "from (select from "+CONSTANTS.CLASSES.VERTICES.NODES+" where id = :id) maxdepth 1)", { params : whereObj}).all();
//       resolve(nodeArray);
//     });
//     return promise.then(function(nodeArray) {
//       nodeDict = {}
//       for (var i = 1; i < nodeArray.length; i++) {
//         var item = nodeArray[i];
//         (nodeDict[d.id] || (nodeDict[d.id] = [])).push({title: item.title, nodeID: item.id, story: item.story, color: item.color});
//       }
//       if  (Object.keys(nodeDict).length > 0) {
//         returnArray.push(nodeDict);
//       }
//     });
//   })).then(function () {
//     return returnArray;
//   });
// }
//
// async function createNodeObject (result) {
//   const storyRelatedArray = await createRelatedStory(result[12].value, CONSTANTS.CLASSES.EDGES.RELATED);
//   const storyProposedArray = await createRelatedStory(result[12].value, CONSTANTS.CLASSES.EDGES.PROPOSED);
//   var returnObject = {};
//   if(result[0].value.length > 0) {
//     returnObject = {
//       'nodeID': result[0].value[0].id,
//       'title': result[0].value[0].title,
//       'contact': result[2].value[0].name,
//       'projectTitle': (result[1].value[0] !== undefined ? result[1].value[0].title : undefined),
//       'projectInfo': (result[1].value[0] !== undefined ? result[1].value[0].projectInfo : undefined),
//       'institute': result[7].value.map(institute => institute.name),
//       'story': result[0].value[0].story,
//       'dynamic': (result[9].value[0].dynamic === "T"),
//       'vizContent': result[9].value[0].vizContent,
//       'vizOptions': result[9].value[0].vizOptions,
//       "text": result[9].value[0].text,
//       "format": result[9].value[0].format,
//       'comment': result[9].value[0].comment,
//       'referenceYears': result[9].value[0].referenceYearS,
//       'dataSource': result[3].value.map(datasource => datasource.source),
//       'storyStart': result[0].value[0].storyStart,
//       'storyEnd': result[0].value[0].storyEnd,
//       'color': result[0].value[0].color,
//           'previous': result[4].value.length > 0 ? {
//         'title': result[4].value[0].title,
//         'nodeID': result[4].value[0].id
//       } : {},
//
//       'after': result[5].value.length > 0 ? {
//         'title': result[5].value[0].title,
//         'nodeID': result[5].value[0].id
//       } : {},
//
//       'related': createRelated(result[6].value),
//       'proposed': createRelated(result[8].value),
//       'previousNodes': createRelated(result[10].value),
//       'afterNodes': createRelated(result[11].value),
//       'storyNodes': createRelated(result[12].value),
//       'storyRelated': storyRelatedArray,
//       'storyProposed': storyProposedArray,
//
//     };
//
//   }
//   return returnObject;
// }
//
// function createThemesTree (result) {
//   themeTree = {"name": "root", "children": []};
//   result[1].value.forEach(function(theme) {
//                 var themeObj = {"name": theme.distinct, "color": "", "children": []};
//                 for (var i = 0; i < result[0].value.length; i++) {
//                   if (result[0].value[i].topic === themeObj.name) {
//                     var story = {"name": result[0].value[i].story, "id": result[0].value[i].id, "color": result[0].value[i].colorTopic, "value":1};
//                     themeObj["color"] = result[0].value[i].colorTopic;
//                     themeObj.children.push(story);
//                   }
//                 }
//                 themeTree.children.push(themeObj);
//   });
//   return themeTree;
// }
//
// ////////////////testing functions//////////////////////////////
// function dbGraph(req, res, next){
//   console.log("calling DB - get graph");
//
//   page.title = "DB content test";
//   //page.values = [{title:"1"},{title:"2"},{title:"3"},{title:"4"}];
//
//   q.allSettled([
//     orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).all().map(function(d) { return {title: d.title};})
//   ]).then(function(result) {
//     if(result[0].state == "fulfilled") {
//       page.title += " successful";
//       console.log("connection successfull");
//       page.values = result[0].value;
//     } else {
//       console.error("= = = = = = ERROR");
//       page.title += " failed";
//
//     }
//
//   }).then(function() {
//     console.log("rendering content test page");
//     res.render('dbcon', {
//       page: page
//     });
//   });
// }
// function dbConnection(req, res, next){
//   console.log("calling DB - get graph");
//
//   page.title = "DB connection test";
//
//   q.allSettled([
//     orientDb.select().from(CONSTANTS.CLASSES.VERTICES.NODES).all()
//   ]).then(function(result) {
//     if(result[0].state == "fulfilled") {
//       page.title += " successful";
//       console.log("connection successfull");
//       console.log(result[0].value);
//     } else {
//       console.error("= = = = = = ERROR");
//       page.title += " failed";
//
//     }
//
//   }).then(function() {
//     console.log("rendering page");
//     res.render('dbcon', {
//       page: page
//     });
//   });
//
//
// };

