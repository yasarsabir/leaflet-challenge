// Store our API endpoint as queryUrl.
let queryUrl =
    //"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
    "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
//"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`
        <h3> Epicentre: ${feature.properties.place}</h3>
        <hr><p> Time of Earthquake: ${new Date(feature.properties.time)}</p>
        <hr><p> Magnitude: ${feature.properties.mag}</p>
        <hr><p> Earthquake Depth: ${feature.geometry.coordinates[2]}</p>`
        
        );
    }
//Creating the markers
function pointToLayer (geoJsonPoint, latlng) {
    return L.circleMarker (latlng);
}

function style (feature) {
    console.log(feature)
    return {
        stroke: false,
        fillOpacity: 0.75,
        color: "white",
        fillColor: getColor(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag)
    }
}

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer,
        style: style
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers. We need 3 base maps - satellite, grayscale and outdoors
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay. THE advanced OVERLAY SHOULD BE BOTH TECTONIC PLATES AND  EARTHQUAKES
    let overlayMaps = {
        Earthquakes: earthquakes
        //Tectonic Plates: tectonics, would add the other maps here but didn't get time
    };


    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //the legend
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

}



//MARKERS

// A function to determine the marker size based on the earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

    // Define arrays to hold the created earthquake markers.
    let earthquakeMarkers = [];

    // Loop through earthquakes, and create the earthquakes markers.
    for (let i = 0; i < earthquake.length; i++) {
        // Setting the marker radius for the earthquake by passing magnitude into the markerSize function
        earthquakeMarkers.push(
            L.circle(earthquakes[i].coordinates, {
                stroke: false,
                fillOpacity: 0.75,
                color: "white",
                fillColor: getColor(earthquakeDepth),
                radius: markerSize(features.properties.mag)
            })
        );
    }

    //marker color is depth of earthquake. geometry.coordinates[2]
    let earthquakeDepth = feature.geometry.coordinates[2]
    function getColor(depth) {
        return depth > 90 ? `red` :
            depth > 70 ? `darkorange` :
                depth > 50 ? `orange` :
                    depth > 30 ? `yellow` :
                        depth > 10 ? `palegreen` :
                            `green`
}


    