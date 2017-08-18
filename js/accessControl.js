
// ************** Generate the svgs  *****************
var accessControlOverviewWidthTotal = 1000;
var accessControlOverviewHeightTotal = 150;
var accessControlTimelineWidthTotal = 800;
var accessControlTimelineHeightTotal = 160;
var accessControlDetailsWidthTotal = 4000;
var accessControlDetailsHeightTotal = 754;
var nacWidthTotal = 4000;
var nacHeightTotal = 754;

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    accessControlOverviewWidth = accessControlOverviewWidthTotal - margin.right - margin.left,
    accessControlOverviewHeight = accessControlOverviewHeightTotal - margin.top - margin.bottom,
    accessControlTimelineWidth = accessControlTimelineWidthTotal - margin.right - margin.left,
    accessControlTimelineHeight= accessControlTimelineHeightTotal - margin.top - margin.bottom;
    accessControlDetailsWidth = accessControlDetailsWidthTotal - margin.right - margin.left,
    accessControlDetailsHeight= accessControlDetailsHeightTotal - margin.top - margin.bottom;
    nacWidth = nacWidthTotal - margin.right - margin.left,
    nacHeight= nacHeightTotal - margin.top - margin.bottom;

//color set
var rectColorSet = ["#cccccc", "#109618"]

//svgs
var svgAccessControlOverview,
	  svgAccessControlTimeline,
    svgAccessControlDetails,
    svgNAC;

//rect
var rectWidth = 100;
var rectHeight = 30;

//text in rect
var textX = 25;
var textY = 28;

//data structure for access control overview
var accessControlObj;

//data structure for timeline
class TimelineEntry {
  constructor(label) {
    this.label = label;
    this.times = [];
  }

  addTimeEntry(timeEntry){
    this.times.push(timeEntry);
  }
}

class TimelineTimeEntry {
  constructor(color, startTime, endTime) {
    this.color = color;
    this.starting_time = startTime;
    this.ending_time = endTime;
  }
}

var accessControlTimelineData = [
      {label: "Alice", times: [{"color":"#3366cc", "starting_time": 1355752800000, "ending_time": 1355759900000},
                                  {"color":"#3366cc", "starting_time": 1355767900000, "ending_time": 1355774400000}]},
      {label: "Bob", times: [{"color":"#dc3912", "starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
      {label: "Caros", times: [{"color":"#ff9900", "starting_time": 1355761910000, "ending_time": 1355763910000}]}
    ];

//selected query data structure from overview
var acQuery = {};

//onClick functions
var selectACRect;

//data structure for access control tree
var acTreeRoot;

//nac tree
var nacTreeRoot;

//init svgs
function createAccessControlSvgs() {

  //append svg for overview
  svgAccessControlOverview = d3.select("#view-container").append("svg")
    .attr("id", "accessControlOverview")
    .attr("viewbox", "0, 0, " + accessControlOverviewWidthTotal + ", " + accessControlOverviewHeightTotal)
    .attr("width", accessControlOverviewWidth + margin.right + margin.left)
    .attr("height", accessControlOverviewHeight + margin.top + margin.bottom)

  d3.select("svg#accessControlOverview").append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("Overview");

  //append svg for timeline
  svgAccessControlTimeline = d3.select("#view-container").append("svg")
    .attr("id", "accessControlTimeline")
    .attr("width", accessControlTimelineWidthTotal)
    .attr("height", accessControlTimelineHeightTotal)

  //svg for access control details
  svgAccessControlDetails = d3.select("#view-container").append("svg")
    .attr("id", "accessControlDetails")
    .attr("viewbox", "0, 0, " + accessControlDetailsWidthTotal + ", " + accessControlDetailsHeightTotal)
    .attr("width", accessControlDetailsWidth + margin.right + margin.left)
    .attr("height", accessControlDetailsHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.select("svg#accessControlDetails").append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("Details");

  d3.select(self.frameElement).style("height", "500px");

  //add g in svgs
  //add g.user with text
  svgAccessControlOverview.append("g")
    .attr("id", "user")
    .attr("transform", "translate(" + 100 + "," + margin.top*2 + ")")
    .append("text")
  	.attr("id", "acOverview-text")
  	.text("User");

  //add g.activityType
  svgAccessControlOverview.append("g")
    .attr("id", "activityType")
    .attr("transform", "translate(" + 300 + "," + margin.top*2 + ")")
  .append("text")
    .attr("id", "acOverview-text")
    .text("Activity Type");

  //add g.activity
  svgAccessControlOverview.append("g")
    .attr("id", "activity")
    .attr("transform", "translate(" + 500 + "," + margin.top*2 + ")")
    .append("text")
    .attr("id", "acOverview-text")
    .text("Activity");

  //add g.location
  svgAccessControlOverview.append("g")
    .attr("id", "timeLocation")
    .attr("transform", "translate(" + 700 + "," + margin.top*2 + ")")
    .append("text")
    .attr("id", "acOverview-text")
    .text("Location");

  //init data for timeline
  accessControlTimelineData = [
      // {label: "", times: [{"color":"white", "starting_time": 1355752800000, "ending_time": 1355759900000}]},
      // {label: "", times: [{"color":"white", "starting_time": 1355759910000, "ending_time": 1355761900000}]},
      // {label: "", times: [{"color":"white", "starting_time": 1355761910000, "ending_time": 1355763910000}]}
  ];

  acQuery = {};

  updateAccessControlSvgs();

  //transition
  d3.selectAll("rect")
  .transition()
  .duration(500)
  .attr("fill", rectColorSet[0]);
}

function updateAccessControlSvgs(){
  //append rect and text in g.user
  var i = 0;
  d3.select("g#user")
  	.selectAll("rect")
  	.data(accessControlObj.meta.userList)
  	.enter()
  	.append("rect")
    .attr("class", "user")
    .attr("id", function(d) {return d.ndnName;})
  	.attr("x", 0)
  	.attr("y", function(d) { var newY=10+rectHeight*i; ++i; return newY; })
  	.attr("width", rectWidth)
  	.attr("height", rectHeight)
  	.attr("stroke","black")
  	.attr("stroke-width","1")
  	.attr("fill", "white")
  	.on("click", selectACRect);

  var i = 0;
  d3.select("g#user")
  	.selectAll("text#user")
  	.data(accessControlObj.meta.userList)
  	.enter()
  	.append("text")
  	.attr("id", "user")
  	.attr("x", textX)
   	.attr("y", function(d) { var newY=textY+rectHeight*i; ++i; return newY; })
   	.attr("font-size", "12px")
  	.text( function(d) {return d.name});

  //append rect and text in g.activityType
  var i = 0;
  d3.select("g#activityType")
  	.selectAll("rect")
  	.data(accessControlObj.meta.activityTypeList)
  	.enter()
  	.append("rect")
    .attr("class", "activityType")
    .attr("id", function(d) {return d.ndnName;})
  	.attr("x", 0)
  	.attr("y", function(d) { var newY=10+rectHeight*i; ++i; return newY; })
  	.attr("width", rectWidth)
  	.attr("height", rectHeight)
  	.attr("stroke","black")
  	.attr("stroke-width","1")
  	.attr("fill", "white")
  	.on("click", selectACRect);

  var i = 0;
  d3.select("g#activityType")
  	.selectAll("text#activityType")
  	.data(accessControlObj.meta.activityTypeList)
  	.enter()
  	.append("text")
  	.attr("id", "user")
  	.attr("x", textX)
   	.attr("y", function(d) { var newY=textY+rectHeight*i; ++i; return newY; })
   	.attr("font-size", "12px")
  	.text( function(d) {return d.name});

  //append rect and text in g.activity
  var i = 0;
  d3.select("g#activity")
  	.selectAll("rect")
  	.data(accessControlObj.meta.activityList)
  	.enter()
  	.append("rect")
    .attr("class", "activity")
    .attr("id", function(d) {return d.ndnName;})
  	.attr("x", 0)
  	.attr("y", function(d) { var newY=10+rectHeight*i; ++i; return newY; })
  	.attr("width", rectWidth)
	  .attr("height", rectHeight)
    .attr("fill", "white")
  	.attr("stroke","black")
  	.attr("stroke-width","1")
    .on("click", selectACRect);

  var i = 0;
  d3.select("g#activity")
  	.selectAll("text#activity")
  	.data(accessControlObj.meta.activityList)
  	.enter()
  	.append("text")
  	.attr("id", "user")
  	.attr("x", textX)
   	.attr("y", function(d) { var newY=textY+rectHeight*i; ++i; return newY; })
   	.attr("font-size", "12px")
  	.text( function(d) {return d.name});

  //append rect and text in g.location
  var i = 0;
  d3.select("g#location")
  	.selectAll("rect")
  	.data(accessControlObj.meta.locationList)
  	.enter()
  	.append("rect")
    .attr("class", "location")
    .attr("id", function(d) {return d.ndnName;})
  	.attr("x", 0)
  	.attr("y", function(d) { var newY=10+rectHeight*i; ++i; return newY; })
  	.attr("width", rectWidth)
  	.attr("height", rectHeight)
  	.attr("stroke","black")
  	.attr("stroke-width","1")
  	.attr("fill", "white")
  	.on("click", selectACRect);

  var i = 0;
  d3.select("g#location")
  	.selectAll("text#location")
  	.data(accessControlObj.meta.activityList)
  	.enter()
  	.append("text")
  	.attr("id", "user")
  	.attr("x", textX)
   	.attr("y", function(d) { var newY=textY+rectHeight*i; ++i; return newY; })
   	.attr("font-size", "12px")
  	.text( function(d) {return d.name});

  
  updateAccessControlTimeline();
}

function updateAccessControlTimeline(){
  //remove all elements in timeline svg
  d3.select("svg#accessControlTimeline")
    .selectAll("*")
    .remove();

  //add time line
  var chart = d3.timeline()
    .beginning(1355752800000) // we can optionally add beginning and ending times to speed up rendering a little
    .ending(1355774400000)
    .stack() // toggles graph stacking
    .margin({left:70, right:30, top:0, bottom:0});

  svgAccessControlTimeline.datum(accessControlTimelineData)
    .call(chart);
}

function filterAccessControlTimelineDataByQuery() {
  var filterUser = acQuery["user"];
  var filterActivityType = acQuery["activityType"];
  var filterActivity = acQuery["activity"];

  if (!filterActivity) {
    filterActivity = "";
  }

  var filterRule = "";
  if (filterActivityType) {
    if (!filterActivity)
      filterRule = "/"+filterActivityType;
    else
      filterRule = "/"+filterActivityType+"/"+filterActivity;
  }
  
  console.log(acQuery);
  console.log(filterUser);
  console.log(filterRule);


  accessControlTimelineData = [];
  if (filterRule == "") {
    //donothing
  } else {
    for (var i in accessControlObj["accessList"]) { 
      //access details for each user
      var userAccessDetailsEntry = accessControlObj["accessList"][i];

      if (userAccessDetailsEntry["user"] == filterUser) {
        var accessDetails = userAccessDetailsEntry["accessDetails"];
        for (var j in accessDetails){
          //create an entry for accessControlTimelineData
          var newEntry = new TimelineEntry(accessDetails[j]["username"]);
          
          for (var k in accessDetails[j]["access"]) {
            //add time entry 
            var curAccess = accessDetails[j]["access"][k];
            
            if (filterRule.startsWith(curAccess["gradularity"])) {
              var newTimeEntry = new TimelineTimeEntry(colorSet[j], curAccess["start"], curAccess["end"]);
              newEntry.addTimeEntry(newTimeEntry);
            }
          }

          accessControlTimelineData.push(newEntry);
          console.log("add an new entry: ", newEntry);
        }
      }
    }
  }

  //update access control tree
  if (filterUser) {
    console.log("update ac tree: ", filterUser);
    acTreeRoot = findNodeInNameTree(nameRoot, filterUser);

    console.log("\n found node: ", acTreeRoot);
    if (acTreeRoot === null) {
      acTreeRoot = {
        "depth" : 1,
        "children" : [],
        "components" : [filterUser]
      };
    }
    updateAccessControlTree(acTreeRoot);
  }
}

function resetRectColorByClass(selectedClass) {
  //reset rect color in access control overview
  if (selectedClass == "all") {
    console.log(selectedClass);
    d3.select("svg#accessControlOverview")
    .selectAll("rect")
    .transition()
    .duration(400)
    .attr("fill", rectColorSet[0]);
  } else {
    console.log(selectedClass);
    d3.select("svg#accessControlOverview")
    .selectAll("."+selectedClass)
    .transition()
    .duration(400)
    .attr("fill", rectColorSet[0]);
  }
}

var selectACRect = (function(){
    return function(){
      // accessControlTimelineData = [
      // {label: "Alice", times: [{"color":"#3366cc", "starting_time": 1355752800000, "ending_time": 1355759900000},
      //                             {"color":"#3366cc", "starting_time": 1355767900000, "ending_time": 1355774400000}]},
      // {label: "Bob", times: [{"color":"#dc3912", "starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
      // {label: "Caros", times: [{"color":"#ff9900", "starting_time": 1355761910000, "ending_time": 1355763910000}]}
      // ];
      var currentColor = d3.select(this).attr("fill");
      var selectedClass = d3.select(this).attr("class");
      var selectedId = d3.select(this).attr("id");

      //if the selected is a user, reset all rect color
      if (selectedClass == "user") {
        if (acQuery[selectedClass] == selectedId) {
          //reselect
          acQuery = {};
          resetRectColorByClass("all");
        } else {
          //select
          acQuery = {};
          acQuery[selectedClass] = selectedId;
          resetRectColorByClass("all");
        }
      } else {
      //select other rect as the query
        if (acQuery[selectedClass] == selectedId) {
          acQuery[selectedClass] = "";
        } else {
          acQuery[selectedClass] = selectedId;
          resetRectColorByClass(selectedClass);
        }
      }

      filterAccessControlTimelineDataByQuery();
      updateAccessControlTimeline();

      //finally change color
      currentColor = currentColor == rectColorSet[0] ? rectColorSet[1] : rectColorSet[0];
      
      d3.select(this)
        .transition()
        .duration(400)
        .attr("fill", currentColor);
    }
})();


function updateAccessControlTree(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(acTreeRoot).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 120; });

  // Update the nodes
  var node = svgAccessControlDetails.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + source.y + "," + source.x + ")"; 
    })
    .on("click", acTreeClick)
    .on("dblclick", acTreeDoubleClick)
    .on("mouseover", function(d){ d3.select(this).selectAll("text").style("display", "block"); })
    .on("mouseout", function(d){ 
      if (d.textName.length < 20 || d.depth < 2) {
        d3.select(this).selectAll("text").style("display", "block");
      } else {
        d3.select(this).selectAll("text").style("display", "none");
      }
    });

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {
      if (d.children == undefined && !d._children) 
        return dataNodeColor;
      
      return colorSet[d.depth % colorSet.length + 2];
    });
  
  // append text on top of the nodes
  var dy = 0.5;

  nodeEnter.append("text")
    .attr("id", function(d) {  return "text-name-" + d.id.toString(); })
    .attr("x", function(d) { return d.children || d._children ? 0 : 0; })
    .attr("dy", function(d) { return d.children || d._children ? "-" + dy.toString() + "em" : dy.toString() + "em"; })
    .attr("text-anchor", function(d) { return d.children || d._children ? "middle" : "start"; })
    .text(updateText)
    .style("fill-opacity", 1e-6)
    .style("display", function(d) {
      if (d.textName.length < 20 || d.depth < 2) {
        return "block";
      } else {
        return "none";
      }
    });

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
    })
    .style("fill", function(d) {
      if (d.children == undefined && !d._children) 
        return dataNodeColor;
      
      return colorSet[d.depth % colorSet.length + 2];
    });
  
  nodeUpdate.select("text")
    .text(updateText)
    .style("fill-opacity", 1)
    .style("display", function(d) {
      if (d.textName.length < 20 || d.depth < 2) {
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
  var link = svgAccessControlDetails.selectAll("path.link")
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

  // Stash the old positions for transition.
  // nodes.forEach(function(d) {
  //   d.x0 = d.x;
  //   d.y0 = d.y;
  // });
}


function acTreeClick(d){

  d3.select("svg#accessControlDetails")
    .selectAll("circle")
    .style("stroke", function(d) {
      d._selected = false;
      if (d._selected) {
        return "#000";
      }
      return "#fff";
    });
  
  var indexOfFor = d.components.indexOf("FOR");
  var indexOfCKey = d.components.indexOf("C-KEY");
  var indexOfEKey = d.components.indexOf("E-KEY");
  if (indexOfFor > -1 && indexOfCKey > -1 && indexOfEKey == -1){
    d._selected = true;

    var CKeyName = "/" + d.components.slice(indexOfFor+1, d.components.length).join("/");
    console.log("ckey name : ", CKeyName);
    var CKeyNode = findLeafInNameTree(nameRoot, CKeyName);
    CKeyNode._selected = true;
    console.log("ckey node : ", CKeyNode);

    var EKeyName = "/" + CKeyNode.components.slice(indexOfFor+1, CKeyNode.components.length).join("/");
    console.log("ekey name : ", EKeyName);
    var EKeyNode = findLeafInNameTree(nameRoot, EKeyName);
    EKeyNode._selected = true;
    console.log("ekey node : ", EKeyNode);

    var DKeyNodes = [];
    var DKeyName = EKeyName.replace("E-KEY", "D-KEY");
    console.log("dkey name : ", DKeyName);
    findLeavesInNameTree(DKeyNodes, nameRoot, DKeyName);
    for (var n in DKeyNodes) {
      DKeyNodes[n]._selected = true;
    }
    console.log("dkey nodes : ", DKeyNodes);

    // nacTreeData = d;
    // insertToNacTree(nacTreeData, )

    d3.select("svg#accessControlDetails")
      .selectAll("circle")
      .transition()
      .duration(1000)
      .style("stroke", function(d) {
        // console.log(d);
        if (d._selected) {
          // console.log(d);
          return "red";
        }
        return "#fff";
      })
      .style("stroke-width", function(d) {
        if (d._selected) {
          return 3;
        }
      });
  }
}

function acTreeDoubleClick(d){
  console.log("DDDDD");

  d3.select("svg#accessControlDetails")
    .selectAll("circle")
    .transition()
    .duration(1000)
    .style("stroke", function(d) {
      d._selected = false;
      return "#fff";
    })
   .style("stroke-width", function(d) {
        return 1;
    });
  
  var indexOfFor = d.components.indexOf("FOR");
  var indexOfCKey = d.components.indexOf("C-KEY");
  var indexOfEKey = d.components.indexOf("E-KEY");
  if (indexOfFor > -1 && indexOfCKey > -1 && indexOfEKey == -1){
    
    var CKeyName = "/" + d.components.slice(indexOfFor+1, d.components.length).join("/");
    var CKeyNode = findLeafInNameTree(nameRoot, CKeyName);

    nacTreeRoot = new nacTreeNode(GetFullName(d).replace(CKeyName, "/<C-KEY-Name>"), "Data");

    indexOfFor = CKeyNode.components.indexOf("FOR");
    var EKeyName = "/" + CKeyNode.components.slice(indexOfFor+1, CKeyNode.components.length).join("/");
    var EKeyNode = findLeafInNameTree(nameRoot, EKeyName);

    var nacTreeNodeCKey = new nacTreeNode(GetFullName(CKeyNode).replace(EKeyName, "/<E-KEY-Name>"), "C-KEY");
    insertToNacTree(nacTreeRoot, nacTreeRoot, nacTreeNodeCKey);

    var nacTreeNodeEKey = new nacTreeNode(GetFullName(EKeyNode), "E-KEY");
    insertToNacTree(nacTreeRoot, nacTreeNodeCKey, nacTreeNodeEKey);

    var DKeyNodes = [];
    var DKeyName = EKeyName.replace("E-KEY", "D-KEY");
    findLeavesInNameTree(DKeyNodes, nameRoot, DKeyName);
    for (var n in DKeyNodes) {
      var nacTreeNodeDKey = new nacTreeNode(GetFullName(DKeyNodes[n]), "D-KEY");
      insertToNacTree(nacTreeRoot, nacTreeNodeEKey, nacTreeNodeDKey);

      //public key
      tmpArray = GetFullName(DKeyNodes[n]).split("/");
      indexOfFor = tmpArray.indexOf("FOR");
      var PKeyName = "/" + tmpArray.slice(indexOfFor+1, tmpArray.length).join("/");
      var nacTreeNodePKey = new nacTreeNode(PKeyName, "Public KEY");
      insertToNacTree(nacTreeRoot, nacTreeNodeDKey, nacTreeNodePKey);
    }
    
    console.log("nacTreeRoot : ", nacTreeRoot);

    //remove svg for details
    d3.select("svg#accessControlDetails").remove();

    //create svg for NAC tree
    svgNAC = d3.select("#view-container").append("svg")
      .attr("id", "NAC")
      .attr("viewbox", "0, 0, " + nacWidthTotal + ", " + nacHeightTotal)
      .attr("width", nacWidth + margin.right + margin.left)
      .attr("height", nacHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("svg#NAC").append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text("NAC");

    d3.select("svg#NAC").append("rect")
      .attr("id", "back")
      .attr("x", 50)
      .attr("y", 0)
      .attr("width", rectWidth/2)
      .attr("height", rectHeight/1.2)
      .attr("stroke","black")
      .attr("stroke-width","1")
      .attr("fill", "white")
      .on("click", goBack);

    d3.select("svg#NAC").append("text")
      .attr("x", 60)
      .attr("y", 20)
      .text("back")
      .on("click", goBack);

    //update nactree
    updateNACTree(nacTreeRoot);
  }
}

var goBack = (function(){
    return function(){
      d3.select("svg#NAC").remove();
      console.log("BBB");

      //svg for access control details
      svgAccessControlDetails = d3.select("#view-container").append("svg")
        .attr("id", "accessControlDetails")
        .attr("viewbox", "0, 0, " + accessControlDetailsWidthTotal + ", " + accessControlDetailsHeightTotal)
        .attr("width", accessControlDetailsWidth + margin.right + margin.left)
        .attr("height", accessControlDetailsHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.select("svg#accessControlDetails").append("text")
        .attr("x", 10)
        .attr("y", 20)
        .text("Details");

      console.log("goBack: ", acTreeRoot);

      updateAccessControlTree(acTreeRoot);
    }
})();

class nacTreeNode {
  constructor(name, type){
    this.name = name;
    this.children = [];
    this.dataType = type;
  }
}

function findNodeInNacTree(r, node) {
  if (r == node)
    return r;
  else {
    for (i in r.children) {
      var result = findNodeInNacTree(r.children[i], node);
      if (result != null)
        return result;
    }
  }
  return null;
}

function insertToNacTree(r, p, c) {
  var node = findNodeInNacTree(r, p);
  if (node != null) {
    node.children.push(c);
  }
}

function updateNACTree(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(source).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 120; });

  // Update the nodes
  var node = svgNAC.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + source.y + "," + source.x + ")"; 
    })
    .on("mouseover", function(d){ d3.select(this).selectAll("text#ndnName").style("display", "block"); })
    .on("mouseout", function(d){ 
  
      d3.select(this).selectAll("text#ndnName").style("display", "none");
     
    });;

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {

      return colorSet[d.depth % colorSet.length];
    });
  
  // append data type on top of the nodes, and ndnName on bottom
  var dy = 2;

  nodeEnter.append("text")
    .attr("id", function(d) {  return "dataType"; })
    .attr("x", 0)
    .attr("dy", function(d) { return "-" + dy.toString() + "em"; })
    .attr("text-anchor", function(d) { return "middle"; })
    .text( function(d) { return d.dataType })
    .style("fill-opacity", 1e-6)
    .style("display", function(d) {
      return "block";
    });

  nodeEnter.append("text")
    .attr("id", function(d) {  return "ndnName"; })
    .attr("x", function(d) { return d.children || d._children ? 0 : 0; })
    .attr("dy", function(d) { return dy.toString() + "em"; })
    .attr("text-anchor", function(d) { return "start"; return d.children || d._children ? "middle" : "start"; })
    .text( function(d) { return d.name })
    .style("fill-opacity", 1e-6)
    .style("display", function(d) {
      return "none";
    });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; 
    });

  nodeUpdate.selectAll("circle")
    .attr("r", 10);
  
  nodeUpdate.selectAll("text")
    .style("fill-opacity", 1);

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
  var link = svgNAC.selectAll("path.link")
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