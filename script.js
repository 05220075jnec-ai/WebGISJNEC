// TASK 1: Paste map creation code here
const map = L.map("map").setView([27.5, 90.4], 8);

// Add scale control
L.control.scale({ position: "bottomright" }).addTo(map);

// TASK 2: Paste basemap code here
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Additional basemaps
const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "© Esri"
});

const terrain = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenTopoMap"
});

const basemaps = {
  "OpenStreetMap": osm,
  "Satellite": satellite,
  "Terrain": terrain
};

// TASK 3: Paste layer group code here
const dzongkhagLayer = L.layerGroup().addTo(map);
const educationLayer = L.layerGroup().addTo(map);
const healthLayer = L.layerGroup().addTo(map);


// TASK 4: Paste zoom function here
function zoomToBhutan() {
  map.setView([27.5, 90.4], 8);
}

// TASK 5: Paste GeoJSON layer loading code here

fetch("./Data/bhutan_dzong_web.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "#333",
        weight: 2,
        fillColor: "orange",
        fillOpacity: 0.3
      },
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        const name = props.Dzongkhag || props.NAME || props.name || "Unknown";
        const popupContent = `
          <strong>${name}</strong><br>
          <small>Click to zoom</small>
        `;
        layer.bindPopup(popupContent);
        
        // Zoom to dzongkhag on click
        layer.on("click", function() {
          const bounds = layer.getBounds();
          map.fitBounds(bounds, { padding: [50, 50] });
        });
      }
    }).addTo(dzongkhagLayer);
  });

fetch("./Data/bhutan_education_center.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          color: "blue",
          fillColor: "#3399ff",
          fillOpacity: 0.9,
          weight: 2
        });
      },
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        const name = props.Name || props.name || props.EDU_NAME || "Education Center";
        const level = props.Level || props.level || "N/A";
        const popupContent = `
          <strong>${name}</strong><br>
          <b>Level:</b> ${level}<br>
          <b>Type:</b> Education Center
        `;
        layer.bindPopup(popupContent);
        
        // Highlight on hover
        layer.on("mouseover", function() {
          this.setStyle({ radius: 12, color: "#000", weight: 3 });
        });
        layer.on("mouseout", function() {
          this.setStyle({ radius: 8, color: "blue", weight: 2 });
        });
      }
    }).addTo(educationLayer);
  });

fetch("./Data/bhutan_health_center.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          color: "red",
          fillColor: "#ff6666",
          fillOpacity: 0.9,
          weight: 2
        });
      },
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        const name = props.Name || props.name || props.HEALTH_NAME || "Health Center";
        const type = props.Type || props.type || "N/A";
        const popupContent = `
          <strong>${name}</strong><br>
          <b>Type:</b> ${type}<br>
          <b>Category:</b> Health Center
        `;
        layer.bindPopup(popupContent);
        
        // Highlight on hover
        layer.on("mouseover", function() {
          this.setStyle({ radius: 12, color: "#000", weight: 3 });
        });
        layer.on("mouseout", function() {
          this.setStyle({ radius: 8, color: "red", weight: 2 });
        });
      }
    }).addTo(healthLayer);
  });


// TASK 6: Paste layer control code here
const overlayMaps = {
  "Dzongkhag Boundary": dzongkhagLayer,
  "Education Centers": educationLayer,
  "Health Centers": healthLayer
};

L.control.layers(basemaps, overlayMaps, { collapsed: false }).addTo(map);

// Add locate me button
const locateBtn = L.control({ position: "topleft" });
locateBtn.onAdd = function() {
  const btn = L.DomUtil.create("button", "locate-btn");
  btn.innerHTML = "� Locate Me";
  btn.style.padding = "8px 12px";
  btn.style.cursor = "pointer";
  btn.style.background = "white";
  btn.style.border = "2px solid gray";
  btn.style.borderRadius = "4px";
  
  btn.onclick = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const { latitude, longitude } = position.coords;
          L.marker([latitude, longitude], { title: "You are here" })
            .addTo(map)
            .bindPopup("📍 You are here!")
            .openPopup();
          map.setView([latitude, longitude], 14);
        },
        function() {
          alert("Unable to get your location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };
  return btn;
};
locateBtn.addTo(map);

// ========== BUTTONS ==========

// 1. Print button
const printBtn = L.control({ position: "topleft" });
printBtn.onAdd = function() {
  const btn = L.DomUtil.create("button", "print-btn");
  btn.innerHTML = "🖨️ Print";
  btn.style.padding = "8px 12px";
  btn.style.cursor = "pointer";
  btn.style.background = "white";
  btn.style.border = "2px solid gray";
  btn.style.borderRadius = "4px";
  
  btn.onclick = function() {
    window.print();
  };
  return btn;
};
printBtn.addTo(map);

// 2. Zoom In button
const zoomInBtn = L.control({ position: "topleft" });
zoomInBtn.onAdd = function() {
  const btn = L.DomUtil.create("button", "zoom-in-btn");
  btn.innerHTML = "➕";
  btn.style.padding = "8px 12px";
  btn.style.cursor = "pointer";
  btn.style.background = "white";
  btn.style.border = "2px solid gray";
  btn.style.borderRadius = "4px";
  btn.style.marginTop = "5px";
  btn.style.fontSize = "16px";
  
  btn.onclick = function() {
    map.zoomIn();
  };
  return btn;
};
zoomInBtn.addTo(map);

// 3. Zoom Out button
const zoomOutBtn = L.control({ position: "topleft" });
zoomOutBtn.onAdd = function() {
  const btn = L.DomUtil.create("button", "zoom-out-btn");
  btn.innerHTML = "➖";
  btn.style.padding = "8px 12px";
  btn.style.cursor = "pointer";
  btn.style.background = "white";
  btn.style.border = "2px solid gray";
  btn.style.borderRadius = "4px";
  btn.style.marginTop = "5px";
  btn.style.fontSize = "16px";
  
  btn.onclick = function() {
    map.zoomOut();
  };
  return btn;
};
zoomOutBtn.addTo(map);

// 4. Toggle Layers button
let layersVisible = true;
const toggleLayersBtn = L.control({ position: "topleft" });
toggleLayersBtn.onAdd = function() {
  const btn = L.DomUtil.create("button", "toggle-btn");
  btn.innerHTML = "👁️ Layers";
  btn.style.padding = "8px 12px";
  btn.style.cursor = "pointer";
  btn.style.background = "white";
  btn.style.border = "2px solid gray";
  btn.style.borderRadius = "4px";
  btn.style.marginTop = "5px";
  
  btn.onclick = function() {
    if (layersVisible) {
      map.removeLayer(dzongkhagLayer);
      map.removeLayer(educationLayer);
      map.removeLayer(healthLayer);
      btn.innerHTML = "👁️ Show";
    } else {
      dzongkhagLayer.addTo(map);
      educationLayer.addTo(map);
      healthLayer.addTo(map);
      btn.innerHTML = "👁️ Layers";
    }
    layersVisible = !layersVisible;
  };
  return btn;
};
toggleLayersBtn.addTo(map);

// 5. Thimphu button
const capitalBtn = L.control({ position: "topleft" });
capitalBtn.onAdd = function() {
  const btn = L.DomUtil.create("button", "capital-btn");
  btn.innerHTML = "🏛️ Thimphu";
  btn.style.padding = "8px 12px";
  btn.style.cursor = "pointer";
  btn.style.background = "white";
  btn.style.border = "2px solid gray";
  btn.style.borderRadius = "4px";
  btn.style.marginTop = "5px";
  
  btn.onclick = function() {
    map.setView([27.4728, 89.6393], 12);
    L.marker([27.4728, 89.6393])
      .addTo(map)
      .bindPopup("<strong>🏛️ Thimphu</strong><br>Capital of Bhutan")
      .openPopup();
  };
  return btn;
};
capitalBtn.addTo(map);

// 6. Search dzongkhag
const searchControl = L.control({ position: "topleft" });
searchControl.onAdd = function() {
  const div = L.DomUtil.create("div", "search-control");
  div.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search dzongkhag..." 
           style="padding: 6px; width: 150px; border: 2px solid gray; border-radius: 4px;">
    <button id="searchBtn" style="padding: 6px 10px; cursor: pointer;">🔍</button>
  `;
  div.style.marginTop = "5px";
  return div;
};
searchControl.addTo(map);

// Search functionality
document.addEventListener("click", function(e) {
  if (e.target.id === "searchBtn" || e.target.closest("#searchBtn")) {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    dzongkhagLayer.eachLayer(function(layer) {
      if (layer.feature && layer.feature.properties) {
        const name = layer.feature.properties.Dzongkhag || 
                     layer.feature.properties.NAME || 
                     layer.feature.properties.name || "";
        if (name.toLowerCase().includes(searchTerm)) {
          map.fitBounds(layer.getBounds(), { padding: [50, 50] });
          layer.openPopup();
        }
      }
    });
  }
});

// 7. Map Stats
const statsControl = L.control({ position: "topright" });
statsControl.onAdd = function() {
  const div = L.DomUtil.create("div", "stats-control");
  div.style.background = "white";
  div.style.padding = "10px";
  div.style.border = "2px solid gray";
  div.style.borderRadius = "4px";
  div.style.minWidth = "150px";
  div.innerHTML = "<strong>📊 Map Stats</strong><br><span>Loading...</span>";
  return div;
};
statsControl.addTo(map);

// Update stats after layers load
setTimeout(function() {
  let dzongkhagCount = 0;
  let educationCount = 0;
  let healthCount = 0;
  
  dzongkhagLayer.eachLayer(function() { dzongkhagCount++; });
  educationLayer.eachLayer(function() { educationCount++; });
  healthLayer.eachLayer(function() { healthCount++; });
  
  const statsDiv = document.querySelector(".stats-control");
  if (statsDiv) {
    statsDiv.innerHTML = `
      <strong>📊 Map Stats</strong><br>
      <hr>
      🟠 Dzongkhags: ${dzongkhagCount}<br>
      🔵 Education: ${educationCount}<br>
      🔴 Health: ${healthCount}<br>
      <hr>
      <small>Total: ${dzongkhagCount + educationCount + healthCount} features</small>
    `;
  }
}, 2000);