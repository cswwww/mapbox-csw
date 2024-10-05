/*
 * @Date: 2023-12-29 08:56:26
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-09-15 16:46:16
 * @FilePath: \mapbox-re\src\map\tool\measureTool.js
 * @Description: 工具 - 测量工具
 */
import { centroid } from '@turf/turf'
import { Marker } from 'mapbox-gl'
import { getLineDistance, getPolygonArea } from '../index.js'

/**
 * @description:
 * 点图层名称: measurePointLayer
 * 线图层名称: measureLineLayer
 * 动态线图层名称: measureDynamicLineLayer
 */
class DistanceMeasurement {
  nodeCoordinateList // 节点坐标
  pointFeatureCollection // 点GeoJSON集合
  lineFeatureCollection // 线GeoJSON集合
  resMarkerList // 测量结果
  dynamicMarkDom // 动态结果所在元素
  dynamicMark // 动态结果
  constructor(map) {
    this.map = map
    this.addPoint = this.addPoint.bind(this)
    this.end = this.end.bind(this)
    this.dynamicAction = this.dynamicAction.bind(this)
  }
  // 初始化图层
  init() {
    // 添加线图层
    this.map.addLayer({
      id: 'measureLineLayer',
      type: 'line',
      source: {
        type: 'geojson',
        data: this.lineFeatureCollection
      },
      paint: {
        'line-color': '#ffff00',
        'line-width': 2,
        'line-opacity': 1,
        'line-dasharray': [2, 4]
      }
    })

    // 添加动态线图层
    this.map.addLayer({
      id: 'measureDynamicLineLayer',
      type: 'line',
      source: {
        type: 'geojson',
        data: this.lineFeatureCollection
      },
      paint: {
        'line-color': '#ffff00',
        'line-width': 2,
        'line-opacity': 1,
        'line-dasharray': [2, 4]
      }
    })

    // 添加点图层
    this.map.addLayer({
      id: 'measurePointLayer',
      type: 'circle',
      source: {
        type: 'geojson',
        data: this.pointFeatureCollection
      },
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': 3,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffff00'
      }
    })
  }

  // 重置数据
  reset() {
    this.nodeCoordinateList = []
    this.resMarkerList = []
    this.pointFeatureCollection = {
      type: 'FeatureCollection',
      features: []
    }
    this.lineFeatureCollection = {
      type: 'FeatureCollection',
      features: []
    }

    this.dynamicMarkDom = document.createElement('div')
    this.dynamicMarkDom.setAttribute('class', 'measure-result')
    const option = {
      element: this.dynamicMarkDom,
      anchor: 'left',
      offset: [8, 0]
    }
    this.dynamicMark = new Marker(option).setLngLat([0, 0]).addTo(this.map)
  }

  // 开始测量
  start() {
    this.reset()
    this.init()

    this.map.doubleClickZoom.disable() // 禁止双击缩放
    this.map.getCanvas().style.cursor = 'crosshair' // 设置鼠标样式

    this.map.on('click', this.addPoint)
    this.map.on('dblclick', this.end)
    this.map.on('mousemove', this.dynamicAction)
  }

  // 结束测量
  end(e) {
    this.dynamicMark.remove()
    this.addPoint(e)

    this.map.off('click', this.addPoint)
    this.map.off('dblclick', this.end)
    this.map.off('mousemove', this.dynamicAction)

    // this.map.once('click', (e) => {
    //   this.clear()
    //   this.start()
    // })
    this.map.getCanvas().style.cursor = '' // 恢复鼠标样式
  }

  // 清除测量
  clear() {
    this.map.doubleClickZoom.enable() // 恢复双击缩放
    this.map.off('click', this.addPoint)
    this.map.off('dblclick', this.end)
    this.map.off('mousemove', this.dynamicAction)

    this.resMarkerList?.forEach((item) => {
      item.remove()
    })
    this.dynamicMark.remove()

    if (this.map.getSource('measurePointLayer')) {
      this.map.removeLayer('measurePointLayer')
      this.map.removeSource('measurePointLayer')
    }
    if (this.map.getSource('measureLineLayer')) {
      this.map.removeLayer('measureLineLayer')
      this.map.removeSource('measureLineLayer')
    }
    if (this.map.getSource('measureDynamicLineLayer')) {
      this.map.removeLayer('measureDynamicLineLayer')
      this.map.removeSource('measureDynamicLineLayer')
    }
  }

  // 添加点
  addPoint(e) {
    const lngLat = [e.lngLat.lng, e.lngLat.lat]
    const pointList = this.pointFeatureCollection
    const lineList = this.lineFeatureCollection

    if (pointList.features.length > 0) {
      let prev = pointList.features[pointList.features.length - 1]
      lineList.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [prev.geometry.coordinates, lngLat]
        }
      })
      this.map.getSource('measureLineLayer').setData(lineList)
    }

    pointList.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: lngLat
      }
    })
    this.map.getSource('measurePointLayer').setData(pointList)

    const ele = document.createElement('div')
    ele.setAttribute('class', 'measure-result')
    const option = {
      element: ele,
      anchor: 'left',
      offset: [8, 0]
    }

    ele.innerHTML =
      this.nodeCoordinateList.length === 0
        ? '起点'
        : getLineDistance(this.nodeCoordinateList.concat([lngLat]))
    const marker = new Marker(option).setLngLat(lngLat).addTo(this.map)
    this.resMarkerList.push(marker)
    this.nodeCoordinateList.push(lngLat)
  }

  // 鼠标移动事件
  dynamicAction(e) {
    const pointList = this.pointFeatureCollection
    const lngLat = [e.lngLat.lng, e.lngLat.lat]
    if (pointList.features.length > 0) {
      const prev = pointList.features[pointList.features.length - 1]
      const json = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [prev.geometry.coordinates, lngLat]
        }
      }
      this.map.getSource('measureDynamicLineLayer').setData(json)
      this.dynamicMarkDom.innerHTML = getLineDistance(this.nodeCoordinateList.concat([lngLat]))
    } else {
      this.dynamicMarkDom.innerHTML = '单击地图开始测量，双击结束'
    }
    this.dynamicMark.setLngLat(lngLat)
  }
}

/**
 * @description:
 * 点图层名称: measurePointLayer2
 * 面图层名称: measureFillLayer
 */
class AreaMeasurement {
  nodeCoordinateList // 节点坐标
  pointFeatureCollection // 点GeoJSON集合
  lineFeatureCollection // 线GeoJSON集合
  polygonFeatureCollection // 面GeoJSON集合
  dynamicMarkDom // 动态结果所在元素
  dynamicMark // 动态结果
  constructor(map) {
    this.map = map
    this.addPoint = this.addPoint.bind(this)
    this.end = this.end.bind(this)
    this.dynamicAction = this.dynamicAction.bind(this)
  }
  // 初始化图层
  init() {
    // 添加面图层
    this.map.addLayer({
      id: 'measureFillLayer',
      type: 'fill',
      source: {
        type: 'geojson',
        data: this.lineFeatureCollection
      },
      paint: {
        'fill-color': '#ffff00',
        'fill-opacity': 0.3
      }
    })
    // 添加点图层
    this.map.addLayer({
      id: 'measurePointLayer2',
      type: 'circle',
      source: {
        type: 'geojson',
        data: this.pointFeatureCollection
      },
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': 3,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffff00'
      }
    })
  }

  // 重置数据
  reset() {
    this.nodeCoordinateList = []
    this.pointFeatureCollection = {
      type: 'FeatureCollection',
      features: []
    }
    this.lineFeatureCollection = {
      type: 'FeatureCollection',
      features: []
    }
    this.polygonFeatureCollection = {
      type: 'FeatureCollection',
      features: []
    }

    this.dynamicMarkDom = document.createElement('div')
    this.dynamicMarkDom.setAttribute('class', 'measure-result')
    const option = {
      element: this.dynamicMarkDom,
      anchor: 'left',
      offset: [8, 0]
    }
    this.dynamicMark = new Marker(option).setLngLat([0, 0]).addTo(this.map)
  }

  // 开始测量
  start() {
    this.reset()
    this.init()

    this.map.doubleClickZoom.disable() // 禁止双击缩放
    this.map.getCanvas().style.cursor = 'crosshair' // 设置鼠标样式

    this.map.on('click', this.addPoint)
    this.map.on('dblclick', this.end)
    this.map.on('mousemove', this.dynamicAction)
  }

  // 结束测量
  end(e) {
    this.dynamicMark.remove()
    this.addPoint(e)

    this.map.off('click', this.addPoint)
    this.map.off('dblclick', this.end)
    this.map.off('mousemove', this.dynamicAction)

    const option = {
      element: this.dynamicMarkDom,
      anchor: 'center',
      offset: [0, 0]
    }
    this.dynamicMarkDom.innerHTML = getPolygonArea(null, this.polygonFeatureCollection)
    this.dynamicMark = new Marker(option)
      .setLngLat(centroid(this.polygonFeatureCollection).geometry.coordinates)
      .addTo(this.map)
    this.map.getCanvas().style.cursor = '' // 恢复鼠标样式
  }

  // 清除测量
  clear() {
    this.map.doubleClickZoom.enable() // 恢复双击缩放
    this.map.off('click', this.addPoint)
    this.map.off('dblclick', this.end)
    this.map.off('mousemove', this.dynamicAction)

    this.dynamicMark.remove()

    if (this.map.getSource('measurePointLayer2')) {
      this.map.removeLayer('measurePointLayer2')
      this.map.removeSource('measurePointLayer2')
    }
    if (this.map.getSource('measureFillLayer')) {
      this.map.removeLayer('measureFillLayer')
      this.map.removeSource('measureFillLayer')
    }
  }

  // 添加点
  addPoint(e) {
    const lngLat = [e.lngLat.lng, e.lngLat.lat]
    const pointList = this.pointFeatureCollection

    pointList.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: lngLat
      }
    })
    this.map.getSource('measurePointLayer2').setData(pointList)

    this.nodeCoordinateList.push(lngLat)
  }

  // 鼠标移动事件
  dynamicAction(e) {
    const pointList = this.pointFeatureCollection
    const lngLat = [e.lngLat.lng, e.lngLat.lat]

    const len = pointList.features.length
    if (len === 0) {
      this.dynamicMarkDom.innerHTML = '点击地图开始测量'
    } else if (len === 1) {
      this.dynamicMarkDom.innerHTML = '点击地图继续绘制'
    } else {
      let pts = this.nodeCoordinateList.concat([lngLat])
      pts = pts.concat([this.nodeCoordinateList[0]])
      const json = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [pts]
        }
      }
      this.map.getSource('measureFillLayer').setData(json)
      this.dynamicMarkDom.innerHTML = getPolygonArea(pts)
      this.polygonFeatureCollection = {
        type: 'FeatureCollection',
        features: [json]
      }
    }
    this.dynamicMark.setLngLat(lngLat)
  }
}

export { DistanceMeasurement, AreaMeasurement }
