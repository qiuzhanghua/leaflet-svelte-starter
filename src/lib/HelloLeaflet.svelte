<script lang="ts">
	import {onMount} from 'svelte';

	import L from 'leaflet';
	import 'leaflet.markercluster';
	import 'leaflet.glmarkers';
	import 'leaflet-markers-canvas-exact';

	import 'leaflet/dist/leaflet.css';

	import markerIconUrl from '../../node_modules/leaflet/dist/images/marker-icon.png';
	import markerIconRetinaUrl from '../../node_modules/leaflet/dist/images/marker-icon-2x.png';
	import markerShadowUrl from '../../node_modules/leaflet/dist/images/marker-shadow.png';
	import {randomData} from "./utils";


	let map: L.Map | L.LayerGroup<any> | null = null;
	let markerCurrent: L.Marker | null = null;

	onMount(() => {
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

		// L.marker([39.90217, 116.3912757])
		//   .addTo(map)
		//   .bindPopup('This is Beijing.')
		//   .openPopup();
		map.locate();
		let someFeatures = [
			{
				type: 'Feature',
				properties: {
					name: 'Coors Field',
					show_on_map: true,
				},
				geometry: {
					type: 'Point',
					coordinates: [116, 39.75621],
				},
			},
			{
				type: 'Feature',
				properties: {
					name: 'Busch Field',
					show_on_map: true,
				},
				geometry: {
					type: 'Point',
					coordinates: [117, 39.74621],
				},
			},
		];

		// let pointA = new L.LatLng(40.038771, 116.316335);
		// let pointB = new L.LatLng(40.1, 116.4);
		// let pointList = [pointA, pointB];
		//
		// L.polyline(pointList).addTo(map);
		// L.rectangle([[40, 116.24], [40.1, 116.4]]).addTo(map);

		map.on('click', function (e) {
			if (e.originalEvent.altKey) {
				alert('zoom level ' + map.getZoom());
			} else {
				alert('You clicked the map at ' + e.latlng);
			}
		});

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

		map.on('locationfound', function (e) {
			var radius = e.accuracy / 2;
			if (markerCurrent) {
				markerCurrent.remove();
			}
			markerCurrent = L.marker(e.latlng)
					.addTo(map)
					.bindPopup('You are within ' + radius + ' meters ' + e.latlng.toString())
					.openPopup();
			L.circle(e.latlng, radius).addTo(map);
			// map.setView(e.latlng, 16);
		});
		map.on('locationerror', function (e) {
			console.log(e);
			alert(e.message);
		});
		map.on('zoomend', function (e) {
			console.log('zoomend: ', map.getZoom());
		});
		map.on('moveend', function (e) {
			console.log('moveend: ', map.getCenter());
		});

		const vertexShader = `
attribute vec2 aCRSCoords;
attribute vec2 aExtrudeCoords;
uniform mat4 uTransformMatrix;
uniform vec2 uPixelSize;

void main(void) {
	gl_Position =
		uTransformMatrix * vec4(aCRSCoords, 1.0, 1.0) +
		vec4(aExtrudeCoords * uPixelSize * 15.0, 0.0, 0.0);
}
`;

		const fragmentShader = `
void main(void) {
	gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
}
`;

		// let markers = L.markerClusterGroup();
		// let glMarkers = new L.GLMarkerGroup({
		// 	attributes: ['megacity', 'rank_min', 'rank_max', 'labelrank', 'adm0cap'],
		// 	textures: [],
		// 	vertexShader,
		// 	fragmentShader
		// });
		let markersCanvas = new L.MarkersCanvas();
		markersCanvas.addTo(map);
		let start = new Date().getTime();
		console.log(start);
		let lines = randomData(2000, 100, [116.24, 40, 116.4, 40.1]);
		let count = 0;
		for (let i = 0; i < lines.features.length; i++) {
			let feature = lines.features[i];
			let latlngs = [];
			for (let j = 0; j < feature.geometry.coordinates.length; j++) {
				let point = L.latLng(feature.geometry.coordinates[j][1], feature.geometry.coordinates[j][0]);
				latlngs.push(point);
				// markers.addLayer(L.marker(point));
				// glMarkers.addMarker( new L.GLMarker(
				// 		[point.lat, point.lng],
				// 		{ megacity: 0, labelrank: 5, adm0cap: 1 }
				// ));
				markersCanvas.addMarker(L.marker(point));
				count++;
			}
			L.polyline(latlngs).addTo(map);
		}
		console.log('count = ' + count);
		let end = new Date().getTime();
		console.log(end);
		console.log(end - start + 'ms');
		// markers.addTo(map);
		// glMarkers.addTo(map);
		end = new Date().getTime();
		console.log(end - start + 'ms');
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
