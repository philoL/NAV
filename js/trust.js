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

var signedDataBlackList = [
{"childName":"/org/openmhealth/dpu/KEY/ksk-1501403935/ID-CERT",
 "parentName":"/org/openmhealth/dpu/KEY/ksk-1501403935/ID-CERT"},
 {"childName":"/org/openmhealth/dvu/KEY/ksk-1501399124/ID-CERT",
 "parentName":"/org/openmhealth/dvu/KEY/ksk-1501399124/ID-CERT"}
]

var dataTypeToNameDictionary = {
  "data" : "Data",
  "ckey" : "C-KEY",
  "catalog" : "Catalog",
  "ekey" : "E-KEY",
  "dkey" : "D-KEY",
  "user" : "User's Key",
  "org" : "Org's Key",
  "application" : "Application's Key",
  "dpu": "DPU's Key",
  "dvu": "DVU's Key"
}

// var colorSet = ["#d1ebbb", "#7bafd0", "#deb276", "#92c3ad", "#f49158"];

var trustColorSet = ["#d1ebbb", "#d1eccc", "#d1eddd"];
var c20 = d3.scale.category20c();
var linkColor = "#d1ebbb";
var trustNodeColor = "#AAAAAA";

var colorDictionary = {
  "data" : "#AAAAAA",
  "ckey" : "#990099",
  "catalog" : "#66aa00",
  "ekey" : "#0099c6",
  "dkey" : "#dd4477",
  "user" : "#316395",
  "org" : "#000000",
  "application" : "#22aa99",
  "dpu": "#fd8d3c",
  "dvu": "#e6550d"
}
var selectedPathColor = "#f7df1e";

// ************** Generate the tree diagram  *****************
var trustModelWidthTotal = 4000;
var trustModelHeightTotal = 304;
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
    .attr("transform", "translate(" + margin.left*1.2 + "," + margin.top + ")");

  svgTrustRelationshipTree = d3.select("#view-container").append("svg")
    .attr("id", "trustRelationship")
    .attr("viewbox", "0, 0, " + trustRelationshipWidthTotal + ", " + trustRelationshipHeightTotal)
    .attr("width", trustRelationshipWidth + margin.right + margin.left)
    .attr("height", trustRelationshipHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left*1.2 + "," + margin.top + ")");

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
    .on("mouseover", function(d) {
      if (d._selected || d.name == "") {
        d3.select(this).selectAll("#text-ndnname").style("display", "block");
      }
    })
    .on("mouseout", function(d){
      if (d._selected) {
        d3.select(this).selectAll("#text-ndnname").style("display", "block");
      } else {
        d3.select(this).selectAll("#text-ndnname").style("display", "none");
      }
    });

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {

      //[trust relationship] assign data type according to names
      if (d.name == "" && d.ndnName.includes("FOR") && d.ndnName.includes("C-KEY") && !d.ndnName.includes("E-KEY"))
        d.dataType = "data";

      if (d.name == "" && d.ndnName.includes("catalog"))
        d.dataType = "catalog";

      if (d.name == "" && (d.ndnName.includes("ndnfit") || d.ndnName.includes("access_manager")))
        d.dataType = "application";

      if (d.name == "" && d.ndnName.includes("FOR") && d.ndnName.includes("C-KEY") && d.ndnName.includes("E-KEY"))
        d.dataType = "ckey";

      if (d.name == "" && !d.ndnName.includes("C-KEY") && d.ndnName.includes("E-KEY"))
        d.dataType = "ekey";

      if (d.name == "" && d.ndnName.includes("FOR") && d.ndnName.includes("ksk") && d.ndnName.includes("D-KEY"))
        d.dataType = "dkey";

      if (d.name == "" && d.ndnName.split("/").indexOf("KEY") == 3 && d.ndnName.split("/").indexOf("ID-CERT") == 6)
        d.dataType = "user";

      if (d.name == "" && d.ndnName.split("/").indexOf("KEY") == 3 && d.ndnName.split("/").indexOf("ID-CERT") == 5)
        d.dataType = "org";

      if (d.name == "" && d.ndnName.split("/").indexOf("dpu") == 4)
        d.dataType = "dpu";

      if (d.name == "" && d.ndnName.split("/").indexOf("dvu") == 4 )
        d.dataType = "dvu";

      //update color according to data type
      if (colorDictionary[d.dataType] != undefined) {
        return colorDictionary[d.dataType];
      }

      //for both
      return colorSet[d.depth % colorSet.length];
    });

  // append name text on top of the nodes
  var dy = 1;

  nodeEnter.append("text")
    .attr("id", function(d) {  return "text-name"; })
    .attr("x", function(d) { return d.children || d._children ? 0 : 0; })
    .attr("dy", "-1em")
    // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .attr("text-anchor", "middle")
    .text(function(d){
      if (d.name != "") {
        return d.name;
      } else {
        return dataTypeToNameDictionary[d.dataType];
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
      // return tmpY.toString() + "em";
      return "2em";
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
    .style("stroke", function(d){
        if (d._selected) {
          return selectedPathColor;
        } else {
          return "#fff";
        }
    })
    .style("stroke-width", 3);

  //update text
  nodeUpdate.select("#text-name")
    .style("fill-opacity", 1);

  nodeUpdate.select("#text-ndnname")
    .text(function(d){return d.ndnName})
    .style("fill-opacity", 1)
    .style("display", function(d) {
      //dont show ndnname in trust model
      if (d._selected) {
        return "block";
      } else {
        return "none";
      }
    })
    .style('fill', function(d) {
        if (!d.parent)
          return "#00008B";
        if (d.parent._selected) {
          return "#B22222";
        } else {
          return "#00008B";
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
    })
    .style("stroke", function(d){
      if (d.source._selected == true &&  d.target._selected == true) {
        return selectedPathColor;
      }
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

  var cNodeNameString = data.getName().toString();
  var pNodeNameString = data.getSignature().getKeyLocator().getKeyName().toString();

  if (cNodeNameString.includes("ID-CERT")) {
    var cNodeNameComponents = cNodeNameString.split("/");
    cNodeNameComponents.splice(cNodeNameComponents.indexOf("ID-CERT")+1, cNodeNameComponents.length);
    cNodeNameString = cNodeNameComponents.join("/");
  }

  if (pNodeNameString.includes("ID-CERT")) {
    var pNodeNameComponents = pNodeNameString.split("/");
    pNodeNameComponents.splice(pNodeNameComponents.indexOf("ID-CERT")+1, pNodeNameComponents.length)
    pNodeNameString = pNodeNameComponents.join("/")
  }

  //filter out invalid data
  for (var i in signedDataBlackList) {
    if (cNodeNameString.includes(signedDataBlackList[i]["childName"])&&
        pNodeNameString.includes(signedDataBlackList[i]["parentName"]))
    {
      console.log("*********");
      return;
    }
  }

  console.log("[trust] child: " + cNodeNameString +" ,parent: " + pNodeNameString);

  if (pNodeNameString == "/"){
    console.log("[Not signed] child: " + cNodeNameString +" ,parent: " + pNodeNameString);
    return;
  }

  var cNode = findNodeInTree(root, cNodeNameString);
  var pNode = findNodeInTree(root, pNodeNameString);

  console.log("[trust] found child: ", cNode, " ,parent: ", pNode);

  if (cNode == null && pNode == null) {
    var newNode = {
          "name" : "",
          "ndnName" : pNodeNameString,
          "dataType" : "",
          "children" : [
            {
              "name" : "",
              "ndnName" : cNodeNameString,
              "dataType" : "",
              "children" : new Array(),
            }
          ]
        };

    if (root["children"] == undefined)
      root["children"] = [];

    root.children.push(newNode);

  } else if (cNode != null && pNode == null) {
    //cNode must be the child of the root, add a parent to it
    var tmpP = cNode.parent;
    tmpP.children.splice(tmpP.children.indexOf(cNode), 1);

    var newNode = {
          "name" : "",
          "ndnName" : pNodeNameString,
          "dataType" : "",
          "children" : []
        };

    tmpP.children.push(newNode);
    newNode.children.push(cNode);

  } else if (cNode == null && pNode != null) {
    if (pNode["children"] == undefined)
      pNode["children"] = [];

    var newNode = {
          "name" : "",
          "ndnName" : cNodeNameString,
          "dataType" : "",
          "children" : []
        };

    pNode.children.push(newNode);

  } else {
    //both exist

    //if self signed, added for the 1st time
    if (cNodeNameString == pNodeNameString) {
      var doesChildExist = false;
      for (var i in pNode.children) {
        if (pNode.children[i].ndnName == cNodeNameString) {
          doesChildExist = true;
          break;
        }
      }
      if (!doesChildExist) {
        var newNode = {
          "name" : "",
          "ndnName" : cNodeNameString,
          "dataType" : "",
          "children" : []
        };

        pNode.children.push(newNode);
      }
    } else {
      //at different positions
      if (pNode["children"] == undefined)
        pNode["children"] = [];

      var tmpP = cNode.parent;
      tmpP.children.splice(tmpP.children.indexOf(cNode), 1);

      // cNode.parent = pNode;
      pNode.children.push(cNode);
    }
  }

  if (svgTrustRelationshipTree)
    updateTrustTree(trustRelationshipRoot, trustRelationshipTree, trustRelationshipRoot, svgTrustRelationshipTree);
}

//find the node in the tree with the dataNameString
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

    if (d.ndnName == "/") {
      //selected the root then do nothing 
      return ;
    }

    d._selected = true;

    if (d.parent && d.parent.ndnName != "/") {
      d.parent._selected = true;
    }

    //if it is the trust root, select its root as well
    if (d.dataType == "org") {
      console.log(d);
      for (var i in d.children) {
        if (d.children[i].dataType == "org") {
          d.children[i]._selected = true;
          break;
        }
      }
    }

    //update circle
    d3.select("svg#trustRelationship")
      .selectAll("circle")
      .style("stroke", function(d){
        if (d._selected) {
          return selectedPathColor;
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
          return selectedPathColor;
        }
      })
      .style("stroke-width", function(d){
        if (d.source._selected && d.target._selected) {
          return 3;
        }
      });

    //update text
    d3.select("svg#trustRelationship")
      .selectAll("text#text-ndnname")
      .attr("class", function (d){
        if (d._selected){
          return "selected";
        } else {
          return "unselected";
        }
      })
      .style("display", function(d) {
        if (d._selected) {
          return "block";
        } else {
          return "none";
        }
      })
      .attr("text-anchor", function(d) {
        if (!d.parent)
          return "middle";
        if (d.parent._selected) {
          return "start";
        } else {
          return "end";
        }
      })
      .style('fill', function(d) {
        if (!d.parent)
          return "#00008B";
        if (d.parent._selected) {
          return "#B22222";
        } else {
          return "#00008B";
        }
      });

    //update trust model view
    //reset
    d3.select("svg#trustModel")
      .selectAll("circle")
      .style("stroke", function(d){
        d._selected = false;
        return "#fff";
      });

    d3.select("svg#trustModel")
      .selectAll("path")
      .style("stroke", function(d){return "";})
      .style("stroke-width", 1);

    //on selection
    var childDataType = d.dataType;
    var parentDataType = d.parent.ndnName == "/" ? d.dataType : d.parent.dataType;

    // console.log("child: ", childDataType, "parent: ", parentDataType);
    if (childDataType && parentDataType) {
      //update path
      d3.select("svg#trustModel")
      .selectAll("path")
      .style("stroke", function(d){
        if (d.source.dataType == parentDataType &&  d.target.dataType == childDataType) {
          d.source._selected = true;
          d.target._selected = true;
          return selectedPathColor;
        }
      })
      .style("stroke-width", function(d){
        if (d.source.dataType == parentDataType &&  d.target.dataType == childDataType) {
          return 3;
        }
      });

      //update circle
      d3.select("svg#trustModel")
      .selectAll("circle")
      .style("stroke", function(d){
        if (d._selected) {
          return selectedPathColor;
        } else if (childDataType == "org" && d.dataType == "org") {
          //if the selected is the root TODO:maybe a bug for future
          d._selected = true;
          return selectedPathColor;
        } else {
            return "#fff";
        }
      })
      .style("stroke-width", function(d){
        if (d._selected) {
          return 3;
        }
      });

      //update text in trust model
      d3.select("svg#trustModel")
        .selectAll("text#text-ndnname")
        .attr("class", function (d){
          if (d._selected){
            return "selected";
          } else {
            return "unselected";
          }
        })
        .style("display", function(d) {
          if (d._selected) {
            return "block";
          } else {
            return "none";
          }
        })
        .attr("text-anchor", function(d) {
          if (!d.parent)
            return "middle";
          if (d.parent._selected) {
            return "start";
          } else {
            return "end";
          }
        })
        .style('fill', function(d) {
          if (!d.parent)
            return "#00008B";
          if (d.parent._selected) {
            return "#B22222";
          } else {
            return "#00008B";
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
