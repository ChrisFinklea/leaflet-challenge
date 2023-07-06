// Create get color function for earthquake depth
function getColor(depth) {
  switch (true) {
    case depth <= 20:
      return "#006400"; // darkgreen
    case depth <= 30:
      return "#008000"; // green
    case depth <= 40:
      return "#90EE90"; // lightgreen
    case depth <= 50:
      return "#FFFF00"; // yellow
    case depth <= 60:
      return "#FFA500"; // orange
    case depth <= 70:
      return "#FFC0CB"; // pink
    case depth <= 80:
      return "#FF0000"; // red
    case depth <= 90:
      return "#8B0000"; // darkred
    case depth > 90:
      return "#800080"; // purple
    default:
      return "#000000"; // black
  }
}

function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the earthquakes layer.
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object.
  let map = L.map("map", {
    center: [38.5816, -121.4944],
    zoom: 6,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Create legend
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'legend'),
      depth_level = [20, 30, 40, 50, 60, 70, 80, 90];


    // loop through depth levels and generate a label with a colored square for each.
    for (var i = 0; i < depth_level.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depth_level[i] + 1) + '"></i> ' +
        depth_level[i] + (depth_level[i + 1] ? '&ndash;' + depth_level[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
}

function createMarkers(response) {

  // Pull features from response.
  let features = response.features;

  // Initialize an array to hold earthquake markers.
  let earthquakesMarkers = [];

  // Loop through the earthquake array.
  for (let index = 0; index < features.length; index++) {
    let feature = features[index];

    let earthquakesMarker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      color: getColor(feature.geometry.coordinates[2]),
      fillColor: getColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.5,
      radius: (feature.properties.mag) * 10000
    })
      .bindPopup("<h3>Location: " + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "<h3><h3>Depth: " + feature.geometry.coordinates[2] + "</h3>");

    // Add the marker to the earthquake array.
    earthquakesMarkers.push(earthquakesMarker);
  }

  // Create a layer group that's made from the earthquake array, and pass it to the createMap function.
  createMap(L.layerGroup(earthquakesMarkers));
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
