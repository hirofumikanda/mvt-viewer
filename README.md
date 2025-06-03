# MVT / PBF Viewer

ブラウザ上で `.mvt` や `.pbf` 形式の Mapbox Vector Tile ファイルをアップロードし、GeoJSON 形式で中身を表示するビューワーです。  
[`@mapbox/vector-tile`](https://github.com/mapbox/vector-tile-js) と `Pbf` を使用して解析しています。

## 機能

- `.mvt` または `.pbf` ファイルをアップロード
- Vector Tile の内容（レイヤー名、各フィーチャの属性・ジオメトリ）を GeoJSON 形式で表示
- Vite + Vanilla JavaScript による構成

---

## インストール

```bash
git clone https://github.com/hirofumikanda/mvt-viewer.git
cd mvt-viewer
npm install
