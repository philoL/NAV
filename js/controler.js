

initial();


function initial(){
  createNameTreeSvg();


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
}


function showNameTree(){
  d3.select("svg#trustModel").remove();
  d3.select("svg#trustRelationship").remove();

  var elem = document.getElementById("nameTree");
  if (elem == null) {
    createNameTreeSvg();
  }
  
}


function showTrustView(){
  d3.select("svg#nameTree").remove();
  
  var elem = document.getElementById("trustModel");
  if (elem == null) {
    createTrustSvgs();
  }

}

function showAccessControlView(){

  console.log("callback.toString()");
}