

initial();

function initial(){
  createNameTreeSvg();

  //construct trust model data structure;
  //#hardcode the trust model for open mhealth
   var trustModelObj = [
    {
    "name" : "OpenmHealth",
    "ndnName" : "/org/OpenmHealth",
    "dataType" : "org",
    "children": [
      {"name" : "User",
      "ndnName" : "/org/openmhealth/<user-id>",
      "dataType" : "user",
      "children": [
        {"name" : "Application",
        "dataType" : "application",
        "ndnName" : "/org/openmhealth/<user-id>/<app-id>",
        "children": [
          {"name" : "Data",
          "dataType" : "data",
          "ndnName" : "/org/openmhealth/<user-id>/<app-id>/Data",
          "children": []},
           {"name" : "Catalog",
          "dataType" : "catalog",
          "ndnName" : "/org/openmhealth/<user-id>/<app-id>/Data",
          "children": []},
           {"name" : "C-KEY",
          "dataType" : "ckey",
          "ndnName" : "/org/openmhealth/<user-id>/<app-id>/Data",
          "children": []},
          {"name" : "D-KEY",
          "dataType" : "dkey",
          "ndnName" : "/org/openmhealth/<user-id>/<app-id>/Data",
          "children": []},
          {"name" : "E-KEY",
          "dataType" : "ekey",
          "ndnName" : "/org/openmhealth/<user-id>/<app-id>/Data",
          "children": []}
        ]}
      ]}
    ]}
  ]

  var dataTM = new Data(new Name("/org/openmhealth/TrustModel"));
  dataTM.setContent(JSON.stringify(trustModelObj));
  constructTrustModelTree(dataTM);

  //construct access control policy data structure
  accessControlObj = {
    "meta" : {
      "userList" : [{"name":"49p49Bkph8", "ndnName":"49p49Bkph8"}
                    // ,{"name":"Teng", "ndnName":"teng"}
                    ],
      "activityTypeList" : [{"name" : "Fitness", "ndnName":"fitness"}],
      "activityList" : [{"name":"Step", "ndnName":"step"},
                        {"name":"Heart Rate", "ndnName":"heartrate"}],
      "locationList" : []
    },
    "accessList" : [
      {
        "user" : "49p49Bkph8",
        "accessDetails" : [
          {
            "username" : "dpu",
            "ndnName" : "/org/openmhealth/user-123",
            "access" : [
               {"gradularity": "/fitness/step", "start": "1355752800000", "end" :"1355759900000"},
               {"gradularity": "/fitness/step", "start": "1355767900000", "end" :"1355774400000"}
            ]
          },
          {
            "username" : "dvu",
            "ndnName" : "/org/openmhealth/user-456",
            "access" : [
              {"gradularity": "/fitness", "start": "1355752800000", "end" :"1355774400000"}
            ]
          }
          // ,
          // {
          //   "username" : "Carol",
          //   "ndnName" : "/org/openmhealth/user-789",
          //   "access" : [
          //     {"gradularity": "/fitness/heartrate", "start": "1355761910000", "end" :"1355763910000"}
          //   ]
          // }
        ]
      }
      // ,
      // {
      //   "user" : "teng",
      //   "accessDetails" : [
      //     {
      //       "username" : "Alice",
      //       "ndnName" : "/org/openmhealth/user-123",
      //       "access" : [
      //          {"gradularity": "/fitness", "start": "1355752900000", "end" :"13557591000000"},
      //       ]
      //     },
      //     {
      //       "username" : "Bob",
      //       "ndnName" : "/org/openmhealth/user-456",
      //       "access" : [
      //         {"gradularity": "/fitness/step", "start": "1355759910000", "end" :"1355761900000"}
      //       ]
      //     },
      //     {
      //       "username" : "Carol",
      //       "ndnName" : "/org/openmhealth/user-789",
      //       "access" : [
      //         {"gradularity": "/fitness/heartrate", "start": "1355761910000", "end" :"1355763910000"}
      //       ]
      //     }
      //   ]
      // }
    ]
  }

}


function showNameTree(){
  // d3.select("svg#trustModel").remove();
  // d3.select("svg#trustRelationship").remove();
  // d3.select("svg#accessControlOverview").remove();
  // d3.select("svg#accessControlTimeline").remove();
  // d3.select("svg#accessControlDetails").remove();


  // var elem = document.getElementById("nameTree");
  // if (elem == null) {
  //   createNameTreeSvg();
  // }

  d3.select("#view-container").selectAll("*").remove();
  createNameTreeSvg();
}

function showTrustView(){
  // d3.select("svg#nameTree").remove();
  // d3.select("svg#accessControlOverview").remove();
  // d3.select("svg#accessControlTimeline").remove();
  // d3.select("svg#accessControlDetails").remove();

  // var elem = document.getElementById("trustModel");
  // if (elem == null) {
  //   createTrustSvgs();
  // }
  d3.select("#view-container").selectAll("*").remove();
  createTrustSvgs();
}

function showAccessControlView(){

  // d3.select("svg#trustModel").remove();
  // d3.select("svg#trustRelationship").remove();
  // d3.select("svg#nameTree").remove();

  // var elem = document.getElementById("accessControlOverview");
  // if (elem == null) {
  //   createAccessControlSvgs();
  // }

  d3.select("#view-container").selectAll("*").remove();
  createAccessControlSvgs();
}

