import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";

document.getElementById("file-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name.replace(/\.(mvt|pbf)$/i, ".geojson");

  const tileMatch = file.name.match(/(\d+)[-\/](\d+)[-\/](\d+)/);
  if (!tileMatch) {
    document.getElementById("output").textContent =
      "⚠️ ファイル名に z-x-y または z/x/y を含めてください（例: 14-14591-6480.mvt）";
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
    return;
  }

  // 全レイヤーのフィーチャを統合
  const features = [];

  for (const layerName in tile.layers) {
    const layer = tile.layers[layerName];

    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i).toGeoJSON(x, y, z);
      features.push(feature);
    }
  }

  const geojson = {
    type: "FeatureCollection",
    features: features
  };

  document.getElementById("output").textContent = JSON.stringify(geojson, null, 2);

  const shouldDownload = document.getElementById("auto-download").checked;
  if (shouldDownload) {
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }
});
