import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";

document.getElementById("file-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const tile = new VectorTile(new Pbf(arrayBuffer));

  const output = document.getElementById("output");
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

  output.textContent = JSON.stringify(result, null, 2);
});
