/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-06-07 10:18:57
 * @FilePath: \satellite-web\src\utils\map\layer\heatmapLayer.js
 * @Description: 图层 - 专题图 - 热力图图层单例
 * @ref: https://docs.mapbox.com/style-spec/reference/layers/#heatmap
 */

export class HeatMapLayerInstance {
  sourceID = null // 热力图图层的数据源ID
  constructor(feature, sourceID, option, map) {
    if (!HeatMapLayerInstance.instance) {
      this.map = map
      this.layerName = 'instance-heatMapLayer'
      this.sourceID = sourceID
      this.features = feature
      this.options = {
        id: this.layerName,
        type: 'heatmap',
        source: this.layerName,
        paint: {
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(0, 0, 255, 0)',
            0.1,
            'royalblue',
            0.3,
            'cyan',
            0.5,
            'lime',
            0.7,
            'yellow',
            1,
            'red'
          ],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 3], // default 1
          'heatmap-opacity': 1,
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 18, 20],
          'heatmap-weight': 1
        },
        layout: {
          visibility: 'visible'
        }
      }

      // 对传入的参数则进行处理
      if (option instanceof Object) {
        this.options = Object.assign(this.options, option)
      }
      this.map.addSource(this.layerName, {
        type: 'geojson',
        data: this.feature || {
          type: 'FeatureCollection',
          features: []
        }
      })
      this.map.addLayer(this.options)
      HeatMapLayerInstance.instance = this
    }
    return HeatMapLayerInstance.instance
  }

  static getInstance() {
    return (
      HeatMapLayerInstance.instance || (HeatMapLayerInstance.instance = new HeatMapLayerInstance())
    )
  }

  // 更新图层
  updateLayer(feature, sourceID) {
    this.sourceID = sourceID
    this.features = feature
    if (this.map.getSource(this.layerName)) {
      this.map.getSource(this.layerName).setData(feature)
    } else {
      this.map.addSource(this.layerName, {
        type: 'geojson',
        data: feature || {
          type: 'FeatureCollection',
          features: []
        }
      })
      this.map.addLayer(this.options)
    }
  }

  // 移除图层
  removeLayer() {
    this.sourceID = null
    this.map.removeLayer(this.layerName)
    this.map.removeSource(this.layerName)
  }
}

export class HeatMapLayer {
  sourceID = null // 热力图图层的数据源ID
  constructor(feature, sourceID, option, map) {
    this.map = map
    this.sourceID = sourceID
    this.features = feature
    this.options = {
      id: this.sourceID,
      type: 'heatmap',
      source: this.sourceID,
      paint: {
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(0, 0, 255, 0)',
          0.1,
          'royalblue',
          0.3,
          'cyan',
          0.5,
          'lime',
          0.7,
          'yellow',
          1,
          'red'
        ],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 3], // default 1
        'heatmap-opacity': 1,
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 18, 20],
        'heatmap-weight': 1
      },
      layout: {
        visibility: 'visible'
      }
    }

    // 对传入的参数则进行处理
    if (option instanceof Object) {
      this.options = Object.assign(this.options, option)
    }
    this.map.addSource(this.sourceID, {
      type: 'geojson',
      data: this.feature || {
        type: 'FeatureCollection',
        features: []
      }
    })
    this.map.addLayer(this.options)
    HeatMapLayer.instance = this
  }

  static getInstance() {
    return HeatMapLayer.instance || (HeatMapLayer.instance = new HeatMapLayer())
  }

  // 更新图层
  updateLayer(feature) {
    this.features = feature
    if (this.map.getSource(this.sourceID)) {
      this.map.getSource(this.sourceID).setData(feature)
    } else {
      this.map.addSource(this.sourceID, {
        type: 'geojson',
        data: feature || {
          type: 'FeatureCollection',
          features: []
        }
      })
      this.map.addLayer(this.options)
    }
  }

  // 移除图层
  removeLayer() {
    this.sourceID = null
    this.map.removeLayer(this.sourceID)
    this.map.removeSource(this.sourceID)
  }
}
