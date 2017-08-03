/************************************************
 * D3 sync tree render function
 ************************************************/
var trustModelData = [
  {
    "name": "null",
    "ndnName": "null",
    "children": []
  }
];

var trustRelationshipData = [
  {
    "name": "null",
    "parent": "null",
    "children": []
  }
];

// var colorSet = ["#d1ebbb", "#7bafd0", "#deb276", "#92c3ad", "#f49158"];

var trustColorSet = ["#d1ebbb", "#d1eccc", "#d1eddd"];
var trustNodeColor = "#AAAAAA";

// ************** Generate the tree diagram  *****************
var trustModelWidthTotal = 4000;
var trustModelHeightTotal = 150;
var trustRelationshipWidthTotal = 4000;
var trustRelationshipHeightTotal = 500;
//document.body.clientHeight - document.getElementById("connect-section").offsetHeight- document.getElementById("option-section").offsetHeight;

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    trustModelWidth = trustModelWidthTotal - margin.right - margin.left,
    trustModelHeight = trustModelHeightTotal - margin.top - margin.bottom,
    trustRelationshipWidth = trustRelationshipWidthTotal - margin.right - margin.left,
    trustRelationshipHeight= trustRelationshipHeightTotal - margin.top - margin.bottom;

var trustModelRoot = trustModelData[0],
    trustRelationshipRoot = trustRelationshipData[0];

var trustModelTree = d3.layout.tree().size([trustModelHeight, trustModelWidth]);
var trustRelationshipTree = d3.layout.tree().size([trustRelationshipHeight, trustRelationshipWidth]);

var svgTrustModelTree,
    svgTrustRelationshipTree;

var multiParents = [];

function createTrustSvgs() {

  svgTrustModelTree = d3.select("#view-container").append("svg")
    .attr("id", "trustModel")
    .attr("viewbox", "0, 0, " + trustModelWidthTotal + ", " + trustModelHeightTotal)
    .attr("width", trustModelWidth + margin.right + margin.left)
    .attr("height", trustModelHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svgTrustRelationshipTree = d3.select("#view-container").append("svg")
    .attr("id", "trustRelationship")
    .attr("viewbox", "0, 0, " + trustRelationshipWidthTotal + ", " + trustRelationshipHeightTotal)
    .attr("width", trustRelationshipWidth + margin.right + margin.left)
    .attr("height", trustRelationshipHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.select("svg#trustModel").append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("Trust Model");

  d3.select("svg#trustRelationship").append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("Trust Relationship");

  d3.select(self.frameElement).style("height", "500px");

  trustModelRoot = trustModelData[0];
  trustRelationshipRoot = trustRelationshipData[0];

  updateTrustTree(trustModelRoot, trustModelTree, trustModelRoot, svgTrustModelTree);
  updateTrustTree(trustRelationshipRoot, trustRelationshipTree, trustRelationshipRoot, svgTrustRelationshipTree);
}

function updateTrustTree(source, myTree, myRoot, mySvg) {
  // Summary about how this D3 .update(), .enter(), .exit(), .transition() abstraction works

  // Compute the new tree layout.
  var nodes = myTree.nodes(myRoot).reverse(),
      links = myTree.links(nodes);

  console.log(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 120; });

  // Update the nodes
  var node = mySvg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + source.y + "," + source.x + ")"; 
    })
    .on("click", click)
    .on("dblclick", doubleClick);

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {
      if (d.is_content) {
        return dataNodeColor;
      }
      return trustColorSet[d.depth % trustColorSet.length];
    });
  
  // append name text on top of the nodes
  var dy = 2;

  nodeEnter.append("text")
    .attr("id", function(d) {  return "text-name"; })
    .attr("x", function(d) { return d.children || d._children ? 0 : 0; })
    .attr("dy", "-" + dy.toString() + "em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d){return d.name})
    .style("fill-opacity", 1e-6)
    .style("display", "block");

  // append ndnname text on botom of the nodes
  nodeEnter.append("text")
    .attr("id", function(d) {  return "text-ndnname"; })
    .attr("dx", "-3em")
    .attr("dy",  dy.toString() + "em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d){return d.ndnName})
    .style("fill-opacity", 1e-6)
    .style("display", "block");

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; 
    });

  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("stroke", function(d) {
      if (d._children) {
        return "#000";
      }
      return '#fff';
    });
  
  nodeUpdate.select("#text-name")
    .style("fill-opacity", 1)
    .text(function(d){return d.name});

  // nodeUpdate.select("#text-ndnname")
  //   .style("fill-opacity", 1)
  //   .text(function(d){return d.ndnName});

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links
  var link = mySvg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    })
    .remove();
}

function constructTrustModelTree(data) {

  var dataName = data.getName();
  
  if (!dataName.toUri().includes("TrustModel")) {
    console.log("Wrong Data packet for Trust model");
    return;
  }

  var contentObj = JSON.parse(data.getContentAsBuffer().toString());

  trustModelData = contentObj;

  // var trustModelObj = [
  //   {
  //   "name" : "OpenmHealth",
  //   "ndnName" : "/org/OpenmHealth",
  //   "children": [
  //     {"name" : "User",
  //     "ndnName" : "/org/openmhealth/<user-id>",
  //     "children": [
  //       {"name" : "Device",
  //       "ndnName" : "/org/openmhealth/<user-id>/<device-id>",
  //       "children": [
  //         {"name" : "Application",
  //         "ndnName" : "/org/openmhealth/<user-id>/<device-id>/<app-id>",
  //         "children": [
  //           {"name" : "Data",
  //           "ndnName" : "/org/openmhealth/<user-id>/<device-id>/<app-id>/Data",
  //           "children": []}
  //         ]}
  //       ]}
  //     ]}
  //   ]}
  // ]
}
