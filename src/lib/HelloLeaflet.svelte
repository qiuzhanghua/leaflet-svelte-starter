<script lang="ts">
	import {onMount} from 'svelte';

	import L from 'leaflet';
	// import 'leaflet.markercluster';
	// import 'leaflet.glmarkers';
	import 'leaflet-markers-canvas-exact';

	import 'leaflet/dist/leaflet.css';

	import markerIconUrl from '../../node_modules/leaflet/dist/images/marker-icon.png';
	import markerIconRetinaUrl from '../../node_modules/leaflet/dist/images/marker-icon-2x.png';
	import markerShadowUrl from '../../node_modules/leaflet/dist/images/marker-shadow.png';
	import {randomData} from "./utils";

	let map: L.Map | L.LayerGroup<any> | null = null;
	let markerCurrent: L.Marker | null = null;
	let mockData = null;
	let showMarkers = false;
	let showLines = false;

	function addLines() {
		if (!showLines) {
			return;
		}

		let start = new Date().getTime();
		console.log("start show lines @ " + start);

		for (let i = 0; i < mockData.features.length; i++) {
			let feature = mockData.features[i];
			let latlngs = [];
			for (let j = 0; j < feature.geometry.coordinates.length; j++) {
				let point = L.latLng(feature.geometry.coordinates[j][1], feature.geometry.coordinates[j][0]);
				latlngs.push(point);
			}
			L.polyline(latlngs).addTo(map);
		}
		let end = new Date().getTime();
		console.log("show lines ended @ " + end);
		console.log("show lines in " + (end - start) + 'ms');
	}

	function addMarkers() {
		if (!showMarkers) {
			return;
		}
		let markersCanvas = new L.MarkersCanvas();
		markersCanvas.addTo(map);
		let start = new Date().getTime();
		console.log("show markers @ " + start);

		for (let i = 0; i < mockData.features.length; i++) {
			let feature = mockData.features[i];
			let latlngs = [];
			for (let j = 0; j < feature.geometry.coordinates.length; j++) {
				let point = L.latLng(feature.geometry.coordinates[j][1], feature.geometry.coordinates[j][0]);
				latlngs.push(point);
				markersCanvas.addMarker(L.marker(point));
			}
		}
		let end = new Date().getTime();
		console.log("show lines ended @ " + end);
		console.log("show lines in " + (end - start) + 'ms');
	}

	onMount(() => {
		let start = new Date().getTime();
		mockData = randomData(200000, 200, [116.24, 40, 116.4, 40.1]);
		let end = new Date().getTime();
		console.log("mock data in " + (end - start) + 'ms');

		map = L.map('map').setView([40.038771, 116.316335], 12);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			// attribution:
			//   "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
		}).addTo(map);
		// map.attributionControl.setPrefix(false);
		// or
		map.attributionControl.setPrefix('邱张华');
		L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
		L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
		L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
		L.Icon.Default.imagePath = ''; // necessary to avoid Leaflet adds some prefix to image path.

		// map.on('click', function (e) {
		// 	if (e.originalEvent.altKey) {
		// 		alert('zoom level ' + map.getZoom());
		// 	} else {
		// 		alert('You clicked the map at ' + e.latlng);
		// 	}
		// });

		map.on('contextmenu', function (e) {
			L.marker(e.latlng)
					.addTo(map).bindPopup(e.latlng.toString());
		});

		map.on('keypress', function (e) {
			if (e.originalEvent.key == 'l') {
				console.log(e);
				map.locate();
			}
		});

		// map.on('locationfound', function (e) {
		// 	var radius = e.accuracy / 2;
		// 	if (markerCurrent) {
		// 		markerCurrent.remove();
		// 	}
		// 	markerCurrent = L.marker(e.latlng)
		// 			.addTo(map)
		// 			.bindPopup('You are within ' + radius + ' meters ' + e.latlng.toString())
		// 			.openPopup();
		// 	L.circle(e.latlng, radius).addTo(map);
		// 	// map.setView(e.latlng, 16);
		// });
		// map.on('locationerror', function (e) {
		// 	console.log(e);
		// 	alert(e.message);
		// });
		map.on('zoomend', function (e) {
			console.log('zoomend: ', map.getZoom());
		});
		map.on('moveend', function (e) {
			console.log('moveend: ', map.getCenter());
		});
		addLines();
		addMarkers();

	});
</script>

<div id="map"></div>

<style>
	#map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
