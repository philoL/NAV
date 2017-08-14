/************************************************
 * D3 sync tree render function
 ************************************************/
var trustModelData = [
  {
    "name": "",
    "ndnName": "",
    "dataType" : "",
    "children": new Array()
  }
];

var trustRelationshipData = [
  {
    "name": "",
    "ndnName": "/",
    "dataType" : "",
    "parent": null,
    "children": new Array()
  }
];

// var colorSet = ["#d1ebbb", "#7bafd0", "#deb276", "#92c3ad", "#f49158"];

var trustColorSet = ["#d1ebbb", "#d1eccc", "#d1eddd"];
var trustNodeColor = "#AAAAAA";
var dataNodeColor = "#AAAAAA";

// ************** Generate the tree diagram  *****************
var trustModelWidthTotal = 4000;
var trustModelHeightTotal = 150;
var trustRelationshipWidthTotal = 4000;
var trustRelationshipHeightTotal = 654;
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

//for selection 
var selectedChild,
    selectedParent;

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

  console.log("link " ,links);

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
    .on("click", trustClick)
    .on("dblclick", trustDoubleClick)
    .on("mouseover", function(d){ d3.select(this).selectAll("#text-ndnname").style("display", "block"); })
    .on("mouseout", function(d){
      if (d.ndnName.length < 20 || d.depth < 2 || d.name != "") {
        d3.select(this).selectAll("#text-ndnname").style("display", "block");
      } else {
        d3.select(this).selectAll("#text-ndnname").style("display", "none");
      }
    });

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {
      //assign type as well
      //for trust model
      if (d.name =="Data") {
        d._dataType = "data";
        return dataNodeColor;
      }

      //for trust relationship 
      if (d.name == "" && d.ndnName.includes("FOR") && d.ndnName.includes("C-KEY") && !d.ndnName.includes("E-KEY")) {
        d._dataType = "data";
        return dataNodeColor;
      }

      if (d.name == "" && d.ndnName.includes("catalog")) {
        d._dataType = "catalog";
        return dataNodeColor;
      }


      if (d.name == "" && d.ndnName.includes("ndnfit")) {
        d._dataType = "application";
      }


      //for both
      return colorSet[d.depth % colorSet.length];
    });

  // append name text on top of the nodes
  var dy = 1;

  nodeEnter.append("text")
    .attr("id", function(d) {  return "text-name"; })
    .attr("x", function(d) { return d.children || d._children ? 0 : 0; })
    .attr("dy", "-2em")
    // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .attr("text-anchor", "middle")
    .text(function(d){
      if (d.name != "") {
        return d.name;
      } else {
        return d.ndnName;
      }})
    .style("fill-opacity", 1e-6)
    .style("display", "block");

  // append ndnname text on botom of the nodes
  nodeEnter.append("text")
    .attr("id", function(d) {  return "text-ndnname"; })
    // .attr("dx", "-3em")
    .attr("dy", function(d) {
      var tmpY = (dy % 2 + 1)*1.5;
      dy++;
      return tmpY.toString() + "em";
    })
    .attr("text-anchor", function(d) { 
      if (d.name != "") return "middle";
      else 
        return d.children || d._children ? "middle" : "start"; })
    // .attr("text-anchor", "middle")
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
      // if (d._children) {
      //   return "#fff";
      // }
      return '#fff';
    });

  nodeUpdate.select("#text-name")
    .style("fill-opacity", 1)
    .text(function(d){return d.name});

  nodeUpdate.select("#text-ndnname")
    .text(function(d){return d.ndnName})
    .style("fill-opacity", 1)
    .style("display", function(d) {
      if (d.ndnName.length < 20 || d.depth < 2 || d.name != "") {
        return "block";
      } else {
        return "none";
      }
    });

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
}

function insertToTrustRelationshipTree(root, data) {

  var cNodeNameString = data.getName().toUri();
  var pNodeNameString = data.getSignature().getKeyLocator().getKeyName().toUri();


  console.log("[trust] child: " + cNodeNameString +" ,parent: " + pNodeNameString);



  if (pNodeNameString == "/"){
    console.log("[Not signed] child: " + cNodeNameString +" ,parent: " + pNodeNameString);
    return;
  }

  if (cNodeNameString.includes("uLsLn5csbB")){
    console.log("[uLsLn5csbB] child: " + cNodeNameString);
  }


  var pNode = findNodeInTree(root, pNodeNameString);
  if (pNode == null) {
    pNode = root;
  }
  console.log("[trust] found pNode: ", pNode);
  if (pNode.ndnName != pNodeNameString) {
    pNode = trustRelationshipRoot;
  }

  if (pNode["children"] == undefined) {
    pNode["children"] = [];
  }


  if (pNode.ndnName == "/") {
    //if the parent node is the root, check if the child is already there
    var doesChildExist = false;
    var foundChild;
    var newNode;

    //find child
    for (var i in pNode.children){
      var child = pNode.children[i];
      if (child.ndnName == cNodeNameString) {
        doesChildExist = true;
        foundChild = child;
        break;
      }
    }

    if (doesChildExist) {
      //found
      var tmpchild = foundChild;
      var index = pNode.children.indexOf(foundChild);

      if (index > -1) {
        pNode.children.splice(index, 1);
      }
      
      newNode = {
        "name" : "",
        "ndnName" : pNodeNameString,
        "dataType" : "",
        "children" : [foundChild]
      }
    } else {
      //not found
      newNode = {
        "name" : "",
        "ndnName" : pNodeNameString,
        "dataType" : "",
        "children" : [
          {
            "name" : "",
            "ndnName" : cNodeNameString,
            "dataType" : "",
            "children" : new Array(),
            "parent" : newNode
          }
        ]
      }
    }

    pNode["children"].push(newNode);

  } else {
    //the parent node exists in the tree
    var doesChildExist = false;
    for (var i in pNode.children){
      var child = pNode.children[i];
      if (child.ndnName == cNodeNameString) {
        doesChildExist = true;
        break;
      }
    }

    if (!doesChildExist) {
      //add a new child
      var newNode = {
        "name" : "",
        "ndnName" : cNodeNameString,
        "dataType" : "",
        "children" : new Array()
      }

      pNode["children"].push(newNode);
    }
  }

  if (svgTrustRelationshipTree)
    updateTrustTree(trustRelationshipRoot, trustRelationshipTree, trustRelationshipRoot, svgTrustRelationshipTree);
}

//find the parent node in the tree with the dataNameString
function findNodeInTree(node, dataNameString) {
  // console.log("[trust] findNodeInTree node: ", node, " dataNameString: ", dataNameString);
  if (node.ndnName == dataNameString) {
    return node;
  } else {
    for (var i in node.children) {
      var child = node.children[i];
      var result = findNodeInTree(child, dataNameString);
      if (result != null)
        return result;
    }
  }
  return null;
}

// Toggle children display on click.
function trustClick(d) {

  //not for the tree in trust model
  if (d.name == "") {
    
    //this is a stupid way to
    //update data not view
    d3.select("svg#trustRelationship")
      .selectAll("circle")
      .style("stroke", function(d){ 
        d._selected = false; 
        return "#fff";
      });

    d._selected = true;

    if (d.parent && d.parent.ndnName != "/") {
      d.parent._selected = true;
    } 

    //update circle
    d3.select("svg#trustRelationship")
      .selectAll("circle")
      .style("stroke", function(d){
        if (d._selected) {
          return "#000";
        } else {
          return "#fff";
        }
      })
      .style("stroke-width", function(d){
        if (d._selected) {
          return 3;
        }
      });

    //update path
    d3.select("svg#trustRelationship")
      .selectAll("path")
      .style("stroke", function(d){
        if (d.source.ndnName != "/" && d.source._selected && d.target._selected) {
          return "#000";
        } 
      })
      .style("stroke-width", function(d){
        if (d.source._selected && d.target._selected) {
          return 3;
        }
      });

    //update trust model view
    var childDataType = d._dataType;
    var parentDataType = d.parent.ndnName == "/" ? d._dataType : d.parent._dataType;

    console.log("child: ", childDataType, "parent: ", parentDataType);
    if (d._dataType) {
      d3.select("svg#trustModel")
      .selectAll("path")
      .style("stroke", function(d){
        if (d.source.dataType == parentDataType &&  d.target.dataType == childDataType) {
          return "#000";
        } 
      })
      .style("stroke-width", function(d){
        if (d.source.dataType == parentDataType &&  d.target.dataType == childDataType) {
          return 3;
        }
      });
    }
  }
}

function trustDoubleClick(d) {
  // var textElement = document.getElementById("text-name-" + d.id);
  // if (textElement !== undefined) {
  //   console.log(textElement.style.display);
  //   if (textElement.style.display === "block") {
  //     textElement.style.display = "none";
  //   } else {
  //     textElement.style.display = "block";
  //   }
  // }
}
