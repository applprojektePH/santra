let db = require('../libs/db');

let staticPath = "static/viz/";
let page = {};
let CONSTANTS = require("../libs/constants");
module.exports = function(models){

  let cookie = require('cookie');
  let d3 = require("d3");
  let fs = require('fs');

  this.getOrders = function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    let page = {};
    //db.getOrders(res);
  //   res.render('layout_user', {
  //      page: page
  //    });
  // script(type="text/javascript").
  //        mainStart(!JSON.stringify(page.query))
    // console.log(req);
    // if(Object.keys(req.query).length === 0)
    //   req.query.start = "";
    //
    // page.query = req.query;
    //
    page.query = req.query;
    res.render('layout_user', { page: page});
  };

  this.getGraph = function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    db.getGraph(res);
  };

   this.getThemes = function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    db.getThemes(res);
  };

  this.getNode = function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    db.getNode(req.params.id,res);
  };
  
  this.getRandomNode = function(req, res, next){
    let page = {};
    let CONSTANTS = require("../libs/constants");
    res.setHeader('Content-Type', 'application/json');
    db.getRandomNode(res);

    if(Object.keys(req.query).length === 0)
      req.query.start = "";

    page.query = req.query;

    res.render('layout_user', {
      page: page
    });
  };
  
  this.getAllNodes = function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    db.getAllNodes(res);
  };

  /*this.testMe = function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    db.testMePls(res);
  };*/

};


// REQUESTED DB QUERIES
/*


function searchNodes(searchString) {
	
	return [
		{id:5001, title:'Story Nr 5001'},
		{id:5002, title:'Story Nr 5002'},
		{id:6002, title:'Story Nr 6002'},
		{id:1995, title:'Story Nr 1995'}
		];
}
*/