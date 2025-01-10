/*
 * @Date: 2023-12-27 10:12:03
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-04-26 12:00:30
 * @FilePath: \satellite-web\src\utils\map\layer\highlightLayer.js
 * @Description: 图层 - 高亮图层单例
 */

/**
 * Represents a HighlightLayer.
 */
export class HighlightLayer {
  constructor(feature, map) {
    if (!HighlightLayer.instance) {
      this.map = map
      this.layerName = 'instance-highlightLayer'
      this.feature = feature
      this.map.addSource(this.layerName, {
        type: 'geojson',
        data: this.feature || {
          type: 'FeatureCollection',
          features: [],
        },
      })
      this.map.addLayer({
        type: 'line',
        id: this.layerName,
        source: this.layerName,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'line-color': 'yellow', // #45a2ff
          'line-opacity': 0.8,
          'line-width': 5,
        },
      })
      HighlightLayer.instance = this
    }
    return HighlightLayer.instance
  }

  static getInstance() {
    return HighlightLayer.instance || (HighlightLayer.instance = new HighlightLayer())
  }

  // 更新图层
  updateLayer(feature) {
    this.feature = feature || {
      type: 'FeatureCollection',
      features: [],
    }
    if (this.map.getSource(this.layerName)) {
      this.map.getSource(this.layerName).setData(this.feature)
      this.map.moveLayer(this.layerName, undefined) // 将图层置顶
    }
    else {
      this.map.addSource(this.layerName, {
        type: 'geojson',
        data: this.feature,
      })
      this.map.addLayer(this.options)
      this.map.moveLayer(this.layerName, undefined) // 将图层置顶
    }
  }

  // 移除图层
  removeLayer() {
    try {
      this.map.removeLayer(this.layerName)
      this.map.removeSource(this.layerName)
    }
    catch {
      console.err('高亮图层移除失败')
    }
  }
}
