

initial();


function initial(){
  createNameTreeSvg();
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