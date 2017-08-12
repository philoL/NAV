

initial();

function initial(){
  createNameTreeSvg();

  //construct trust model data structure;
  //#hardcode the trust model for open mhealth
   var trustModelObj = [
    {
    "name" : "OpenmHealth",
    "ndnName" : "/org/OpenmHealth",
    "children": [
      {"name" : "User",
      "ndnName" : "/org/openmhealth/<user-id>",
      "children": [
        {"name" : "Device",
        "ndnName" : "/org/openmhealth/<user-id>/<device-id>",
        "children": [
          {"name" : "Application",
          "ndnName" : "/org/openmhealth/<user-id>/<device-id>/<app-id>",
          "children": [
            {"name" : "Data",
            "ndnName" : "/org/openmhealth/<user-id>/<device-id>/<app-id>/Data",
            "children": []}
          ]}
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
      "userList" : [{"name":"Haitao", "ndnName":"haitao"},
                    {"name":"Teng", "ndnName":"teng"}],
      "activityTypeList" : [{"name" : "Fitness", "ndnName":"fitness"}],
      "activityList" : [{"name":"Step", "ndnName":"step"}, 
                        {"name":"Heart Rate", "ndnName":"heartrate"}],
      "locationList" : []
    },
    "accessList" : [
      {
        "user" : "haitao",
        "accessDetails" : [
          {
            "username" : "Alice",
            "ndnName" : "/org/openmhealth/user-123",
            "access" : [
               {"gradularity": "/fitness/step", "start": "1355752800000", "end" :"1355759900000"},
               {"gradularity": "/fitness/step", "start": "1355767900000", "end" :"1355774400000"}
            ]
          },
          {
            "username" : "Bob",
            "ndnName" : "/org/openmhealth/user-456",
            "access" : [
              {"gradularity": "/fitness", "start": "1355759910000", "end" :"1355761900000"}
            ]
          },
          {
            "username" : "Carol",
            "ndnName" : "/org/openmhealth/user-789",
            "access" : [
              {"gradularity": "/fitness/heartrate", "start": "1355761910000", "end" :"1355763910000"}
            ]
          }
        ]
      },
      {
        "user" : "teng",
        "accessDetails" : [
          {
            "username" : "Alice",
            "ndnName" : "/org/openmhealth/user-123",
            "access" : [
               {"gradularity": "/fitness", "start": "1355752900000", "end" :"13557591000000"},
            ]
          },
          {
            "username" : "Bob",
            "ndnName" : "/org/openmhealth/user-456",
            "access" : [
              {"gradularity": "/fitness/step", "start": "1355759910000", "end" :"1355761900000"}
            ]
          },
          {
            "username" : "Carol",
            "ndnName" : "/org/openmhealth/user-789",
            "access" : [
              {"gradularity": "/fitness/heartrate", "start": "1355761910000", "end" :"1355763910000"}
            ]
          }
        ]
      }
    ]
  }

}


function showNameTree(){
  d3.select("svg#trustModel").remove();
  d3.select("svg#trustRelationship").remove();
  d3.select("svg#accessControlOverview").remove();
  d3.select("svg#accessControlTimeline").remove();
  d3.select("svg#accessControlDetails").remove();

  var elem = document.getElementById("nameTree");
  if (elem == null) {
    createNameTreeSvg();
  }

}

function showTrustView(){
  d3.select("svg#nameTree").remove();
  d3.select("svg#accessControlOverview").remove();
  d3.select("svg#accessControlTimeline").remove();
  d3.select("svg#accessControlDetails").remove();

  var elem = document.getElementById("trustModel");
  if (elem == null) {
    createTrustSvgs();
  }

}

function showAccessControlView(){

  d3.select("svg#trustModel").remove();
  d3.select("svg#trustRelationship").remove();
  d3.select("svg#nameTree").remove();

  var elem = document.getElementById("accessControlOverview");
  if (elem == null) {
    createAccessControlSvgs();
  }
}

