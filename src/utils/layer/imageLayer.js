/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-04-29 09:34:52
 * @FilePath: \satellite-web\src\utils\map\layer\imageLayer.js
 * @Description: 图层 - 图片图层
 */

const rasterOptions = {
  type: 'raster',
  layout: {
    visibility: 'visible', // "visible", "none"
  },
  paint: {
    'raster-brightness-max': 1,
    'raster-brightness-min': 0,
    'raster-contrast': 0, // between -1 and 1
    'raster-fade-duration': 300,
    'raster-hue-rotate': 0,
    'raster-opacity': 1,
    'raster-resampling': 'linear', // "linear", "nearest".
    'raster-saturation': 0, // between -1 and 1
  },
}

class ImageLayer {
  layerName = null // 图层名称
  options = null // 图层参数
  url = null // 图层url
  constructor(layerName, url, coordinates, option, map) {
    this.map = map
    this.url = url
    this.layerName = layerName
    this.coordinates = coordinates
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
      type: 'image',
      url: this.url,
      coordinates: this.coordinates,
    })
    this.map.addLayer(this.options)
  }

  // 移除图层
  removeLayer() {
    this.map.removeLayer(this.layerName)
    this.map.removeSource(this.layerName)
  }

  // 更新图层
  updateLayer(url) {
    this.url = url
    if (this.map.getSource(this.layerName)) {
      this.map.getSource(this.layerName).updateImage({ url: this.url, coordinates: this.coordinates })
    }
  }

  // 聚焦图层
  flyToLayer() {
    this.map.fitBounds(
      [
        [this.coordinates[0][0], this.coordinates[0][1]],
        [this.coordinates[1][0], this.coordinates[2][1]],
      ],
      {
        linear: false,
        animate: true,
        maxDuration: 2000,
        padding: { top: 200, bottom: 200, left: 500, right: 500 },
      },
    )
  }
}

export { ImageLayer }
