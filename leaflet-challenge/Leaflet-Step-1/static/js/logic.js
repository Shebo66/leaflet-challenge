  
// Add all the cityMarkers to a new layer group.
// Now we can handle them as one group instead of referencing each individually


// // Define variables for our tile layers
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

  // Adding tile layer
 var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    // attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Only one base layer can be shown at a time
var baseMaps = {
    Light: light,
    Dark: dark,
    Streets: streets
  };


 
  
  var newtry = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
  
// Function that will determine the color based on the magnitude of earthequake it belongs to
function chooseColor(mag) {
    if(mag>3.0)
     return "blue";
    else if(mag>2.5)
      return "purple";
    else if(mag>2.0)
      return "brown";
    else if(mag>1.5)
      return "red";
    else if(mag>1.0)
      return "orange";
      else if(mag>0.5)
      return "yellow";
     else 
     return "white"
      }

  d3.json(newtry, function(response) {
  
    // Creating a geoJSON layer with the retrieved data
 var earthquakeMarkers = L.geoJson(response, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng)

      },
    style: function(feature) {
      return {
        color: "white",
          // Call the chooseColor function to decide which color to color our neighborhood (color based on magnitude of earthequake)
         radius: feature.properties.mag*5,
         fillColor: chooseColor(feature.properties.mag),
         fillOpacity: 0.5,
        weight: 1.5
      };
    }
  })
  // .addTo(myMap);
  
  // var earthquakeLayer = L.layerGroup(earthquakeMarkers);

   // Create map object and set default layers
   var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 5,
    layers: [light, earthquakeMarkers]
  });

// Overlays that may be toggled on or off
var overlayMaps = {
    Earthquakes: earthquakeMarkers
  };

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,
  //  collapsed ensures that the boxes on the top right are hidden
    {collapsed: false}
    ).addTo(myMap);
  

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
        var colors = ["blue","purple","brown","red","orange","yellow","white"].reverse();
    var labels = [];
    
    // Add min & max
    var legendInfo = "<h1>Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + "0-0.5" + "</div>" + 
        "<div class=\"min\">" + "0.5-1.0" + "</div>" +
        "<div class=\"min\">" + "1.0-1.5" + "</div>" +
        "<div class=\"min\">" + "1.5-2.0" + "</div>" +
        "<div class=\"min\">" + "2.0-2.5" + "</div>" +
        "<div class=\"min\">" + "2.5-3.0" + "</div>" +
        "<div class=\"min\">" + "3.0+" + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    colors.forEach(function(color, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});

  