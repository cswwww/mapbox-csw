/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-06-14 13:59:36
 * @FilePath: \satellite-web\src\utils\map\layer\vectorLayer.js
 * @Description: 图层 - 矢量图层
 * @ref: https://docs.mapbox.com/style-spec/reference/layers/
 */

import {
  envelope,
  explode,
  featureCollection,
  pointOnFeature,
} from '@turf/turf'
import { isValidLngLat } from '../index.js'

export class VectorLayer {
  layerName = null // 图层名称
  options = null // 图层参数
  features = null // 图层数据
  map
  constructor(feature, layerName, option, map) {
    this.map = map
    this.layerName = layerName
    this.features = feature
    this.options = {
      id: this.layerName,
      source: this.layerName,
      // filter: ['==', 'id', ''],
      // metadata: { group: ['groupId'] },
      // slot: '',
      // minzoom: 0,
      // maxzoom: 22,
    }

    // 对传入的参数则进行处理
    if (option instanceof Object) {
      this.options = Object.assign(this.options, option)
    }
    // 判断图层是否存在与绘制图层
    map.addSource(this.layerName, {
      type: 'geojson',
      data: feature || {
        type: 'FeatureCollection',
        features: [],
      },
    })
    map.addLayer(this.options)
  }

  // 更新图层
  updateLayer(feature) {
    this.features = feature || {
      type: 'FeatureCollection',
      features: [],
    }
    if (this.map.getSource(this.layerName)) {
      this.map.getSource(this.layerName).setData(this.features)
    }
    else {
      this.map.addSource(this.layerName, {
        type: 'geojson',
        data: this.features,
      })
      this.map.addLayer(this.options)
    }
  }

  // 移除图层
  removeLayer() {
    this.map.removeLayer(this.layerName)
    this.map.removeSource(this.layerName)

    if (this.map.getSource(`${this.layerName}-text`)) {
      this.map.removeLayer(`${this.layerName}-text`)
      this.map.removeSource(`${this.layerName}-text`)
    }
  }

  // 聚焦图层
  flyToLayer() {
    const features = this.features.features
    const allPointList = [] // 每次获取中心坐标前清空一次坐标列表
    for (let i = 0; i < features.length; i++) {
      // allPointList.push.apply(allPointList, explode(features[i]).features)
      allPointList.push(...explode(features[i]).features)
    }
    // 下一步：地图缩放到所有图斑的范围
    const enveloped = envelope(featureCollection(allPointList))
    const sw = [enveloped.bbox[0], enveloped.bbox[1]] // 西南角
    const ne = [enveloped.bbox[2], enveloped.bbox[3]] // 东北角
    if (isValidLngLat(sw) && isValidLngLat(ne)) {
      this.map.fitBounds([sw, ne], {
        linear: false,
        animate: true,
        maxDuration: 2000,
        padding: { top: 200, bottom: 200, left: 500, right: 500 },
      })
    }
    else {
      // throw new Error('Invalid LngLat(无效的坐标值)')
      console.error('Invalid LngLat(无效的坐标值)')
    }
  }

  // 添加文字注记
  showText(flag, text, option) {
    const textLayerId = `${this.layerName}-text` // ID of your text layer

    if (flag) {
      let pointList = null
      if (this.options.type === 'fill') {
        // 获取面矢量上的点
        pointList = {
          type: 'FeatureCollection',
          features: this.features.features?.map((feature) => {
            const point = pointOnFeature(feature)
            point.properties = feature.properties
            return point
          }),
        }
      }
      else {
        pointList = this.features
      }

      const defaultOption = {
        id: textLayerId,
        type: 'symbol',
        source: {
          type: 'geojson',
          data: pointList || {
            type: 'FeatureCollection',
            features: [],
          },
        },
        layout: {
          'text-field': text,
          'text-size': 16,
          'text-anchor': 'top',
          'text-offset': [0, 1],
          // 'symbol-placement': 'point' // 'point', 'line', 'line-center'
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 2,
          'text-halo-blur': 2,
          'text-opacity': 1,
        },
        metadata: { group: this.options?.metadata?.group },
      }

      // 对传入的参数则进行处理
      if (option instanceof Object) {
        const { layout = {}, paint = {}, minzoom } = option
        Object.assign(defaultOption.layout, layout)
        Object.assign(defaultOption.paint, paint)
        if (minzoom) {
          defaultOption.minzoom = minzoom
        }
      }

      this.map.addLayer(defaultOption)
    }
    else {
      this.map.removeLayer(textLayerId)
      this.map.removeSource(textLayerId)
    }
    // flag ? this.map.setLayoutProperty(textLayerId, 'visibility', 'visible') : this.map.setLayoutProperty(textLayerId, 'visibility', 'none')
  }
}
