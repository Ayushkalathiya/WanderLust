let mapTocken = mapToken
mapboxgl.accessToken = mapTocken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng(E), lat(N)] 
    zoom: 9 // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker( {color: "red"})
.setLngLat(listing.geometry.coordinates)  //get from data
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.location}</h4><p>Exact location provided after bookin</p>`))
.addTo(map);