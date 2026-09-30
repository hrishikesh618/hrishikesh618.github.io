/* Conference venue map.
   Needs Leaflet (loaded from CDN on conferences.html) and a
   <div id="confMap"></div> on the page.

   VENUES mirrors the presentation list further down that page. When a
   presentation is added there, bump the matching count here:
     first = presentations with Hrishikesh as first author
     co    = presentations co-authored but led by someone else

   The basemap deliberately carries no text. OpenStreetMap-derived tiles
   label each place in its own language — Wien, Ελλάδα, 東京 — and the names
   are baked into the tile images, so no setting turns that off. The labels
   therefore come off the map entirely, and the only words on it are the
   English ones written below. */

(function () {
  "use strict";

  var VENUES = [
    /* --- Europe --- */
    { name: "Vienna, Austria",      lat: 48.21,  lng: 16.37,   first: 2, co: 1 },
    { name: "Trieste, Italy",       lat: 45.65,  lng: 13.78,   first: 1, co: 1 },
    { name: "Thessaloniki, Greece", lat: 40.64,  lng: 22.94,   first: 1, co: 1 },
    { name: "Barcelona, Spain",     lat: 41.39,  lng: 2.17,    first: 0, co: 1 },

    /* --- Americas --- */
    { name: "San Francisco, USA",   lat: 37.77,  lng: -122.42, first: 2, co: 0 },

    /* --- Africa --- */
    { name: "Kigali, Rwanda",       lat: -1.94,  lng: 30.06,   first: 1, co: 1 },

    /* --- Asia-Pacific --- */
    { name: "Chiba, Japan",         lat: 35.61,  lng: 140.12,  first: 1, co: 2 },
    { name: "Tokyo, Japan",         lat: 35.68,  lng: 139.65,  first: 1, co: 0 },

    /* --- India --- */
    { name: "Roorkee, India",       lat: 29.87,  lng: 77.89,   first: 2, co: 1 },
    { name: "New Delhi, India",     lat: 28.61,  lng: 77.21,   first: 0, co: 1 }
  ];

  var NAVY = "#08264A";
  var BLUE = "#2E9BE8";
  var LABEL_FROM = 3;

  /* Area-proportional, so a venue with three visits does not swamp one.
     Sized generously because at world zoom the markers are the only thing
     on an otherwise pale basemap. */
  function radius(total) {
    return 8 + Math.sqrt(total) * 5;
  }

  function plural(n, word) {
    return n + " " + word + (n === 1 ? "" : "s");
  }

  function init() {
    var el = document.getElementById("confMap");
    if (!el || typeof L === "undefined") return;

    var map = L.map(el, {
      scrollWheelZoom: false,   // let the page keep scrolling over the map
      worldCopyJump: true,
      minZoom: 1
    }).setView([25, 30], 2);

    /* Esri's light grey canvas base. Its place names live in a separate
       reference layer that we simply do not add, so the basemap carries no
       text at all — and unlike CARTO's equivalent it needs no API key. */
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 12
    }).addTo(map);

    /* Our own labels live on their own layer so they can come and go with
       the zoom rather than pile up on each other. */
    var labels = L.layerGroup();
    var markers = [];

    /* Draw the busiest cities first so smaller circles land on top of them.
       Tokyo sits inside Chiba at world zoom, and New Delhi inside Roorkee;
       this ordering keeps both of each pair readable as nested rings until
       the reader zooms in far enough to separate them. */
    VENUES.slice().sort(function (a, b) {
      return (b.first + b.co) - (a.first + a.co);
    }).forEach(function (venue) {
      var total = venue.first + venue.co;
      if (!total) return;

      var marker = L.circleMarker([venue.lat, venue.lng], {
        radius: radius(total),
        color: NAVY,
        weight: 2,
        fillColor: BLUE,
        fillOpacity: 0.82
      }).addTo(map);

      var lines = [];
      if (venue.first) lines.push(plural(venue.first, "first-author presentation"));
      if (venue.co) lines.push(plural(venue.co, "co-authored presentation"));

      marker.bindPopup("<b>" + venue.name + "</b><br>" + lines.join("<br>"));
      marker.bindTooltip(venue.name + " · " + total, { direction: "top", offset: [0, -4] });
      marker.on("mouseover", function () { this.setStyle({ fillOpacity: 1 }); });
      marker.on("mouseout", function () { this.setStyle({ fillOpacity: 0.82 }); });

      L.marker([venue.lat, venue.lng], {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: "conf-label",
          html: "<span>" + venue.name + "</span>",
          iconSize: [0, 0],
          iconAnchor: [-(radius(total) + 4), 7]
        })
      }).addTo(labels);

      markers.push(marker);
    });

    if (markers.length) {
      map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [40, 40] });
    }

    function labelsForZoom() {
      var on = map.getZoom() >= LABEL_FROM;
      if (on && !map.hasLayer(labels)) map.addLayer(labels);
      else if (!on && map.hasLayer(labels)) map.removeLayer(labels);
    }
    map.on("zoomend", labelsForZoom);
    labelsForZoom();

    /* Click to enable wheel zoom, so the map never hijacks page scrolling. */
    map.on("click", function () { map.scrollWheelZoom.enable(); });
    map.on("mouseout", function () { map.scrollWheelZoom.disable(); });

    var totals = VENUES.reduce(function (acc, venue) {
      acc.first += venue.first;
      acc.co += venue.co;
      if (venue.first + venue.co) acc.places += 1;
      return acc;
    }, { first: 0, co: 0, places: 0 });

    var note = document.getElementById("confMapNote");
    if (note) {
      note.textContent =
        (totals.first + totals.co) + " presentations across " + totals.places +
        " cities in " + COUNTRY_COUNT + " countries — " + totals.first +
        " as first author and " + totals.co + " as co-author. Circle size shows how many " +
        "at each place; click a circle for the breakdown, and zoom in for the names.";
    }
  }

  /* Austria, Italy, Greece, Spain, USA, Rwanda, Japan, India */
  var COUNTRY_COUNT = 8;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
