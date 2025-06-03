import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";

let lastGeoJSON = null;
let lastFileName = null;

document.getElementById("file-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  lastFileName = file.name.replace(/\.(mvt|pbf)$/i, ".geojson"); // 拡張子を置換

  // ファイル名から z, x, y を抽出（例: 14-14591-6480.mvt）
  const tileMatch = file.name.match(/(\d+)[-\/](\d+)[-\/](\d+)/);
  if (!tileMatch) {
    document.getElementById("output").textContent =
      "ファイル名に z-x-y または z/x/y を含めてください（例: 14-14591-6480.mvt）";
    document.getElementById("download-btn").disabled = true;
    return;
  }

  const [, zStr, xStr, yStr] = tileMatch;
  const z = parseInt(zStr, 10);
  const x = parseInt(xStr, 10);
  const y = parseInt(yStr, 10);

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
      const feature = layer.feature(i).toGeoJSON(x, y, z);
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
  a.download = lastFileName || ".geojson";
  a.click();

  URL.revokeObjectURL(url);
});
