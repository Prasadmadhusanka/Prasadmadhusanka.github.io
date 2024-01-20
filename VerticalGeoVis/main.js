let dataset = "";
let visualisation_approach = "";

let jsonNames1 = [
  "./data/d3/berlin_d3_um.json",
  "./data/d3/hamburg_d3_um.json",
  "./data/d3/munich_d3_um.json",
  "./data/d3/cologne_d3_um.json",
  "./data/d3/frankfurt_d3_um.json",
  "./data/d3/stuttgart_d3_um.json",
  "./data/d3/dusseldrof_d3_um.json",
  "./data/d3/leipzig_d3_um.json",
  "./data/d3/dortmund_d3_um.json",
  "./data/d3/essen_d3_um.json",
];

let jsonNames2 = [
  "./data/d3/berlin_d3_dbpedia.json",
  "./data/d3/hamburg_d3_dbpedia.json",
  "./data/d3/munich_d3_dbpedia.json",
  "./data/d3/cologne_d3_dbpedia.json",
  "./data/d3/frankfurt_d3_dbpedia.json",
  "./data/d3/stuttgart_d3_dbpedia.json",
  "./data/d3/dusseldrof_d3_dbpedia.json",
  "./data/d3/leipzig_d3_dbpedia.json",
  "./data/d3/dortmund_d3_dbpedia.json",
  "./data/d3/essen_d3_dbpedia.json",
];

let cities = [
  "Berlin",
  "Hamburg",
  "Munich",
  "Cologne",
  "Frankfurt am Main",
  "Stuttgart",
  "Düsseldorf",
  "Leipzig",
  "Dortmund",
  "Essen",
];

var map = L.map("leaflet-map").setView([51.292243, 9.556749], 6);

var cityLabels = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.{ext}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "png",
  }
);

var OpenTopoMap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
).addTo(map);

var OpenStreetMap_DE = L.tileLayer(
  "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

/*var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);*/

//leaflet layer control
var baseMaps = {
  "Open Topo Map": OpenTopoMap,
  "Open Street Map": OpenStreetMap_DE,
  //Satellite: satellite,
};

L.control.layers(baseMaps).addTo(map);

/*
// Create an overlay layers object
var overlays = {
  "City Labels": cityLabels,
};

L.control.layers(baseMaps, overlays).addTo(map);

// Event listener to show/hide city labels based on the selected layer
map.on("baselayerchange", function (eventLayer) {
  if (eventLayer.name == "Satellite") {
    map.addLayer(cityLabels);
  } else {
    map.removeLayer(cityLabels);
  }
});
*/

var marker = [];
var markerLayer = L.layerGroup();

fetch("./data/marker_data.json")
  .then((response) => response.json())
  .then((data) => {
    for (i = 0; i < data.length; i++) {
      marker[i] = L.marker([data[i].latitude, data[i].longitude], {
        title: data[i].name,
      }).addTo(map);
      marker[i].bindPopup(data[i].name);
      markerLayer.addLayer(marker[i]);

      marker[i].on("click", getMarkerClickHandler(i));
    }
  })
  .catch((error) => console.error("Error:", error));

var searchControl = new L.Control.Search({
  layer: markerLayer, // Add your marker layer here
  propertyName: "title", // Property in the markers to search
  marker: false,
});

searchControl.on("search:locationfound", function (e) {
  e.layer.openPopup();
});

map.addControl(searchControl);

// Custom CSS to style the search control tooltip
var searchIcon = document.querySelector(
  ".leaflet-control-search .search-button"
);
searchIcon.title = "Search Geographic Location"; // Set the tooltip text

function changeNavbarTitle(newTitle, id) {
  document.getElementById(id).innerHTML = newTitle;
  if (id == "navbarTitle1") {
    dataset = newTitle;
  } else {
    visualisation_approach = newTitle;
  }
}

function popupClose(popupId) {
  document.getElementById(popupId).style.display = "none";
}

function warningPopup(id) {
  document.getElementById("warningModal").style.display = "block";
  let message;
  if (id == 1) {
    message =
      "This is a warning message. Please select the dataset before clicking on Location marker.";
  } else {
    message =
      "This is a warning message. Please select the visualisation approach before clicking on Location marker.";
  }
  document.getElementById("warningMessage").innerHTML = message;
}

function getMarkerClickHandler(index) {
  return function () {
    if (
      dataset == "UmweltBundesamt" &&
      visualisation_approach == "Scrolling Approach"
    ) {
      fetch("./data/scrolling/data_for_scrolling_um.json")
        .then((response) => response.json())
        .then((data) => {
          inject_scrolling_approach(data[index]);
        })
        .catch((error) => console.error("Error:", error));
    } else if (
      dataset == "DBpedia" &&
      visualisation_approach == "Scrolling Approach"
    ) {
      fetch("./data/scrolling/data_for_scrolling_dbpedia.json")
        .then((response) => response.json())
        .then((data) => {
          inject_scrolling_approach(data[index]);
        })
        .catch((error) => console.error("Error:", error));
    } else if (
      dataset == "UmweltBundesamt" &&
      visualisation_approach == "Spiral Leaflet Markers Approach"
    ) {
      fetch("./data/spiral/data_for_spiral_leaflet_um.json")
        .then((response) => response.json())
        .then((data) => {
          removeSpiralMapDiv();
          inject_spiral_approach(data[index], 1);
        })
        .catch((error) => console.error("Error:", error));
    } else if (
      dataset == "DBpedia" &&
      visualisation_approach == "Spiral Leaflet Markers Approach"
    ) {
      fetch("./data/spiral/data_for_spiral_leaflet_dbpedia.json")
        .then((response) => response.json())
        .then((data) => {
          removeSpiralMapDiv();
          inject_spiral_approach(data[index], 2);
        })
        .catch((error) => console.error("Error:", error));
    } else if (
      dataset == "UmweltBundesamt" &&
      visualisation_approach == "D3 Zoomable Circle Packing Approach"
    ) {
      inject_d3_approach(cities[index], jsonNames1[index]);
    } else if (
      dataset == "DBpedia" &&
      visualisation_approach == "D3 Zoomable Circle Packing Approach"
    ) {
      inject_d3_approach(cities[index], jsonNames2[index]);
    } else if (dataset != "" && visualisation_approach == "") {
      warningPopup(2);
    } else {
      warningPopup(1);
    }
  };
}

function inject_scrolling_approach(data) {
  document.getElementById("model1").style.display = "block";
  document.getElementById("city_name1").innerHTML = data["city_name"];

  // Get the table body element
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = "";

  // Iterate through the data and create table rows
  for (let i = 0; i < data["data"].length; i++) {
    const row = document.createElement("tr");

    // Create cells for row number, attribute name, and attribute value
    const rowNumberCell = document.createElement("th");
    rowNumberCell.setAttribute("scope", "row");
    rowNumberCell.textContent = i + 1;

    const attributeNameCell = document.createElement("td");
    attributeNameCell.textContent = data["data"][i].attribute_name;

    const attributeValueCell = document.createElement("td");
    attributeValueCell.textContent = data["data"][i].attribute_value;

    const attributeCategoryCell = document.createElement("td");
    attributeCategoryCell.textContent = data["data"][i].attribute_category;

    // Append cells to the row
    row.appendChild(rowNumberCell);
    row.appendChild(attributeNameCell);
    row.appendChild(attributeValueCell);
    row.appendChild(attributeCategoryCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
}

function removeSpiralMapDiv() {
  // Get a reference to the spiral-map div element
  var spiralMapDiv = document.getElementById("spiral_map");

  // Check if the div element exists before attempting to remove it
  if (spiralMapDiv) {
    // Remove the div element
    spiralMapDiv.parentNode.removeChild(spiralMapDiv);
  }
}

function inject_spiral_approach(data, num) {
  document.getElementById("model2").style.display = "block";
  document.getElementById("city_name2").innerHTML = data["city_name"];

  // Get a reference to the modal body element
  var modalBody = document.querySelector("#model2 .modal-body");
  // Create a new div element
  var spiralMapDiv = document.createElement("div");
  spiralMapDiv.setAttribute("id", "spiral_map");
  // Append the new div to the modal body
  modalBody.appendChild(spiralMapDiv);

  var map1;

  map1 = L.map("spiral_map", {
    center: [0, 0], // Center of the map (latitude, longitude)
    zoom: 15, // Initial zoom level
    attributionControl: false, // Disable attribution control
  });

  // Define the center point of the spiral
  var center = { lat: 0, lng: 0 };

  // Generate spiral coordinates
  var spiralCoords = generateSpiral(center, data["data"].length, 0.0001, 0.2);

  // Add markers to the map
  for (var i = 0; i < spiralCoords.length; i++) {
    let category = data["data"][i].attribute_category;
    let markerIcon = changeLeafletMarker(category, num);

    marker[i] = L.marker(spiralCoords[i], {
      icon: markerIcon,
      title: data["data"][i].attribute_name,
    }).addTo(map1);
    var popupContent =
      data["data"][i].attribute_name + ": " + data["data"][i].attribute_value;
    marker[i].bindPopup(popupContent);
  }

  addLegend(num);
}

// Function to generate spiral coordinates
function generateSpiral(center, numMarkers, radiusStep, angleStep) {
  var coords = [];
  var angle = 0;
  var radius = 0;

  for (var i = 0; i < numMarkers; i++) {
    angle += angleStep;
    radius += radiusStep;

    var lat = center.lat + radius * Math.sin(angle);
    var lng = center.lng + radius * Math.cos(angle);

    coords.push([lat, lng]);
  }
  return coords;
}

function changeLeafletMarker(category, num) {
  var redIcon = new L.Icon({
    iconUrl: "./data/icon/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  var greenIcon = new L.Icon({
    iconUrl: "./data/icon/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  var yellowIcon = new L.Icon({
    iconUrl: "./data/icon/marker-icon-yellow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  var purpleIcon = new L.Icon({
    iconUrl: "./data/icon/marker-icon-purple.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  var blackIcon = new L.Icon({
    iconUrl: "./data/icon/marker-icon-black.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  var markerIcon;

  if (num == 1) {
    // Assign the appropriate marker icon based on the category
    switch (category) {
      case "Carbon monoxide (CO)":
        markerIcon = blackIcon;
        break;
      case "Fine dust (PM10)":
        markerIcon = purpleIcon;
        break;
      case "Nitrogen dioxide (NO2)":
        markerIcon = redIcon;
        break;
      case "Ozone (O3)":
        markerIcon = greenIcon;
        break;
      case "Sulfur dioxide (SO2)":
        markerIcon = yellowIcon;
        break;
    }
  } else {
    // Assign the appropriate marker icon based on the category
    switch (category) {
      case "Administrative":
        markerIcon = purpleIcon;
        break;
      case "Geography":
        markerIcon = greenIcon;
        break;
      case "Political":
        markerIcon = redIcon;
        break;
      case "Weather":
        markerIcon = yellowIcon;
        break;
    }
  }
  return markerIcon;
}

function addLegend(num) {
  // Reference to the modal footer element
  var modalFooter = document.querySelector("#model2 .modal-footer");
  modalFooter.innerHTML = "";

  if (num == 2) {
    var categories = ["Admistrative", "Geography", "Political", "Weather"];
    var colors = ["#7824a5", "#30a925", "#cc3337", "#cfae3d"];
  } else {
    var categories = [
      "Carbon monoxide (CO)",
      "Fine dust (PM10)",
      "Nitrogen dioxide (NO2)",
      "Ozone (O3)",
      "Sulfur dioxide (SO2)",
    ];
    var colors = ["#000000", "#7824a5", "#cc3337", "#30a925", "#cfae3d"];
  }

  // Create the legend container
  var legendContainer = document.createElement("div");
  legendContainer.classList.add("legend-container");

  // Create legend items
  for (var i = 0; i < categories.length; i++) {
    var legendItem = document.createElement("div");
    legendItem.classList.add("legend-item");

    // Create color box
    var colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = colors[i];

    // Create category label
    var categoryLabel = document.createElement("span");
    categoryLabel.textContent = categories[i];

    // Append color box and category label to legend item
    legendItem.appendChild(colorBox);
    legendItem.appendChild(categoryLabel);

    // Append legend item to legend container
    legendContainer.appendChild(legendItem);
  }

  // Append legend container to modal footer
  modalFooter.appendChild(legendContainer);
}

function inject_d3_approach(data, jsonurl) {
  document.getElementById("model3").style.display = "block";
  document.getElementById("city_name3").innerHTML = data;
  document.getElementById("d3_svg").innerHTML = "";

  var container = d3.select("#d3_svg");

  var svg = container.append("svg").attr("width", 600).attr("height", 600);

  var margin = 20,
    diameter = +svg.attr("width"),
    g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + diameter / 2 + "," + diameter / 2 + ")"
      );

  var color = d3
    .scaleLinear()
    .domain([-1, 5])
    .range(["hsl(100,90%,80%)", "hsl(200,90%,30%)"])
    .interpolate(d3.interpolateHcl);

  var pack = d3
    .pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  d3.json(jsonurl, function (error, root) {
    if (error) throw error;

    root = d3
      .hierarchy(root)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });

    var focus = root,
      nodes = pack(root).descendants(),
      view;

    var circle = g
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return d.parent
          ? d.children
            ? "node"
            : "node node--leaf"
          : "node node--root";
      })
      .style("fill", function (d) {
        return d.children ? color(d.depth) : null;
      })
      .on("click", function (d) {
        if (focus !== d) zoom(d), d3.event.stopPropagation();
      });
    var text = g
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .style("fill-opacity", function (d) {
        return d.parent === root ? 1 : 0;
      })
      .style("display", function (d) {
        return d.parent === root ? "inline" : "none";
      })
      .text(function (d) {
        if (
          (d.data.station && d.data.attribute_value) ||
          d.data.attribute_value == 0
        ) {
          var fullName =
            d.data.station +
            " ---> " +
            d.data.name +
            " : " +
            d.data.attribute_value;
        } else if (d.data.attribute_value || d.data.attribute_value == 0) {
          var fullName = d.data.name + " : " + d.data.attribute_value;
        } else {
          var fullName = d.data.name;
        }
        return fullName;
      });

    var node = g.selectAll("circle,text");

    svg.style("background", color(-1)).on("click", function () {
      zoom(root);
    });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus;
      focus = d;

      var transition = d3
        .transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function (d) {
          var i = d3.interpolateZoom(view, [
            focus.x,
            focus.y,
            focus.r * 2 + margin,
          ]);
          return function (t) {
            zoomTo(i(t));
          };
        });

      transition
        .selectAll("text")
        .filter(function (d) {
          return d.parent === focus || this.style.display === "inline";
        })
        .style("fill-opacity", function (d) {
          return d.parent === focus ? 1 : 0;
        })
        .on("start", function (d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus) this.style.display = "none";
        });
    }

    function zoomTo(v) {
      var k = diameter / v[2];
      view = v;
      node.attr("transform", function (d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
      });
      circle.attr("r", function (d) {
        return Math.max(0, d.r * k);
      });
    }
  });
}

// Initialize Bootstrap tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// Function to refresh the page
function refreshPage() {
  location.reload(true); // true to force a reload from the server
}

function about() {
  document.getElementById("aboutModal").style.display = "block";
}
