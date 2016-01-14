var http = require("http");
var lastPoint = "";
var lastPoint2 = "";

//Print out error message
function printError(error) {
  console.error(error.message);
}

function get(url) {
  var request = http.get(url, function(response) {
    var body = "";
    //console.log("Got response: " + response.statusCode);

    //Read the data
    response.on('data', function (chunk) {
      body += chunk;
    });

    response.on('end', function() {
      if (response.statusCode === 200) {
        try {
          //Parse the data
          printMessage(body);

        } catch (error) {
          // Parse error
          printError(error);
        }
      } else {
        //Status Code Error
        printError({message: "There was an error. (" + http.STATUS_CODES[response.statusCode] + ")"});
      }
    });
  });

  //Connection error
  request.on('error', printError);
}

//Print out message
function printMessage(data) {
  var myRegexp = /bdsmap\);var point=new google.maps.LatLng\(26\.[\d]+,-80\.[\d]+\);/;
  var match = data.match(myRegexp);
  var point = match[0].match(/26\.[\d]+,-80\.[\d]+/)[0];
  if (point != lastPoint) {
//    console.log(point+","+new Date());
      
    var lon = point.substring(0,point.indexOf(','));
    var lat = point.substring(point.indexOf(',')+1);
    console.log("{'long': "+lon+", 'lat': "+lat+"}");
    lastPoint = point;
  }
}

function makeCall() {
  get("http://suntrolley.metromediaworks.net/mobile/route-map.php?height=546&route=9");
}

console.log("Hello Sun Trolley Las Olas!");
setInterval(makeCall,2000);
