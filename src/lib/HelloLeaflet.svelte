<script lang="ts">
	import {onMount} from "svelte";
	import L from "leaflet";
	import "leaflet/dist/leaflet.css";

	import markerIconUrl from "../../node_modules/leaflet/dist/images/marker-icon.png";
	import markerIconRetinaUrl from "../../node_modules/leaflet/dist/images/marker-icon-2x.png";
	import markerShadowUrl from "../../node_modules/leaflet/dist/images/marker-shadow.png";

	let map = null;
	onMount(() => {
		map = L.map("map").setView([39.90217, 116.3912757], 8);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
		}).addTo(map);
		L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
		L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
		L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
		L.Icon.Default.imagePath = ""; // necessary to avoid Leaflet adds some prefix to image path.

		L.marker([39.90217, 116.3912757]).addTo(map)
				.bindPopup("This is Beijing.")
				.openPopup();

		let someFeatures = [{
			"type": "Feature",
			"properties": {
				"name": "Coors Field",
				"show_on_map": true
			},
			"geometry": {
				"type": "Point",
				"coordinates": [116, 39.75621]
			}
		}, {
			"type": "Feature",
			"properties": {
				"name": "Busch Field",
				"show_on_map": true
			},
			"geometry": {
				"type": "Point",
				"coordinates": [117, 39.74621]
			}
		}];

		L.geoJSON(someFeatures, {
			filter: function(feature, layer) {
				return feature.properties.show_on_map;
			}
		}).addTo(map);
	})
</script>

<div id="map"></div>

<style>
	#map {
		position: absolute;
		top: 0;
		left: 0;
		width: 600px;
		height: 600px;
	}
</style>

