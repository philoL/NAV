

initial();

function initial(){
  createNameTreeSvg();

  //construct trust model data structure;
  //#hardcode the trust model for open mhealth
   var trustModelObj = [
    {
    "name" : "OpenmHealth's Key",
    "ndnName" : "/org/OpenmHealth/KEY/<key-id>/ID-CERT",
    "dataType" : "org",
    "children": [
      {
        "name" : "DPU's Key",
        "ndnName" : "/org/OpenmHealth/dpu/<key-id>/ID-CERT",
        "dataType" : "dpu",
        "children": []
      },
      {
        "name" : "DVU's Key",
        "ndnName" : "/org/OpenmHealth/dvu/<key-id>/ID-CERT",
        "dataType" : "dvu",
        "children": []
      },
      {"name" : "User's Key",
      "ndnName" : "/org/openmhealth/KEY/<user-id>/<key-id>/ID-CERT",
      "dataType" : "user",
      "children": [
        {"name" : "Application's Key",
        "dataType" : "application",
        "ndnName" : "/org/openmhealth/<user-id>/KEY/<app-id>/<key-id>/ID-CERT",
        "children": [
          {"name" : "Data",
          "dataType" : "data",
          "ndnName" : "/org/openmhealth/<user-id>/DATA/<app-id>/[data-name]",
          "children": []},
           {"name" : "Catalog",
          "dataType" : "catalog",
          "ndnName" : "/org/openmhealth/<user-id>/DATA/<app-id>/[catalog-name]",
          "children": []},
           {"name" : "C-KEY",
          "dataType" : "ckey",
          "ndnName" : "/org/openmhealth/<user-id>/DATA/<app-id>/[C-KEY-name]",
          "children": []},
          {"name" : "D-KEY",
          "dataType" : "dkey",
          "ndnName" : "/org/openmhealth/<user-id>/DATA/<app-id>/[D-KEY-name]",
          "children": []},
          {"name" : "E-KEY",
          "dataType" : "ekey",
          "ndnName" : "/org/openmhealth/<user-id>/DATA/<app-id>/[E-KEY-name]",
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
      "userList" : [{"name":"49p49Bkph8", "ndnName":"49p49Bkph8"},
                    {"name":"mNwQJKXRwj", "ndnName":"mNwQJKXRwj"},
                    {"name":"kby08cvYLC", "ndnName":"kby08cvYLC"}
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
      },
      {
        "user" : "mNwQJKXRwj",
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
        ]
      },
      {
        "user" : "kby08cvYLC",
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
        ]
      }
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

