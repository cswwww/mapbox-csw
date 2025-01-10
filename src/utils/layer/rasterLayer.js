/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-03-07 17:42:49
 * @FilePath: \satellite-web\src\utils\map\layer\rasterLayer.js
 * @Description: 图层 - 栅格图层
 */

const rasterOptions = {
  type: 'raster',
  layout: {
    visibility: 'visible', // "visible", "none"
  },
  paint: {
    'raster-brightness-max': 1,
    'raster-brightness-min': 0,
    // 'raster-color': '#000000',
    // 'raster-color-mix': [], // https://docs.mapbox.com/style-spec/reference/layers/#paint-raster-raster-color-mix
    // 'raster-color-range': [0.5, 10],
    'raster-contrast': 0, // between -1 and 1
    'raster-fade-duration': 300,
    'raster-hue-rotate': 0,
    'raster-opacity': 1,
    'raster-resampling': 'linear', // "linear", "nearest".
    'raster-saturation': 0, // between -1 and 1
  },
}

class RasterLayer {
  layerName = null // 图层名称
  options = null // 图层参数
  url = null // 图层url
  constructor(layerName, url, option, map) {
    this.map = map
    this.url = url
    this.layerName = layerName
    this.options = {
      id: this.layerName,
      source: this.layerName,
      minzoom: 0,
      maxzoom: 22,
      ...rasterOptions,
    }

    // 对传入的参数则进行处理
    if (option instanceof Object) {
      this.options = Object.assign(this.options, option)
    }

    this.map.addSource(layerName, {
      type: 'raster',
      tiles: [this.url],
      tileSize: 256,
      // 'attribution': '',
      // 'bounds': bounds
    })

    this.map.addLayer(this.options)
  }

  // 移除图层
  removeLayer() {
    this.map.removeLayer(this.layerName)
    this.map.removeSource(this.layerName)
  }
}

export { RasterLayer }
