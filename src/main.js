import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";

let lastGeoJSON = null;

document.getElementById("file-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  let tile;

  try {
    tile = new VectorTile(new Pbf(arrayBuffer));
  } catch (err) {
    document.getElementById("output").textContent = "⚠️ このファイルはMVT/PBF形式ではありません。";
    document.getElementById("download-btn").disabled = true;
    return;
  }

  const result = {};

  for (const layerName in tile.layers) {
    const layer = tile.layers[layerName];
    const features = [];

    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i).toGeoJSON(0, 0, 0);
      features.push(feature);
    }

    result[layerName] = features;
  }

  lastGeoJSON = result;
  document.getElementById("output").textContent = JSON.stringify(result, null, 2);
  document.getElementById("download-btn").disabled = false;
});

document.getElementById("download-btn").addEventListener("click", () => {
  if (!lastGeoJSON) return;

  const blob = new Blob([JSON.stringify(lastGeoJSON, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tile.geojson";
  a.click();

  URL.revokeObjectURL(url);
});
