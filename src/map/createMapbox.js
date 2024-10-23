/*
 * @Date: 2023-12-18 15:07:10
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-10-23 18:40:01
 * @FilePath: \mapbox-csw\src\map\createMapbox.js
 * @Description: 创建地图单例
 */

import { Map } from 'mapbox-gl'
import { loadBaseLayer, loadLayerGroupsFucntion } from './index.js'

// 地图控件等UI文字的本地化
// const locale = {
//   'AttributionControl.ToggleAttribution': 'Toggle attribution',
//   'AttributionControl.MapFeedback': 'Map feedback',
//   'FullscreenControl.Enter': 'Enter fullscreen',
//   'FullscreenControl.Exit': 'Exit fullscreen',
//   'GeolocateControl.FindMyLocation': 'Find my location',
//   'GeolocateControl.LocationNotAvailable': 'Location not available',
//   'LogoControl.Title': 'Mapbox logo',
//   'Map.Title': 'Map',
//   'NavigationControl.ResetBearing': '修改方向及俯仰角',
//   'NavigationControl.ZoomIn': '放大',
//   'NavigationControl.ZoomOut': '缩小',
//   'ScrollZoomBlocker.CtrlMessage': 'Use ctrl + scroll to zoom the map',
//   'ScrollZoomBlocker.CmdMessage': 'Use ⌘ + scroll to zoom the map',
//   'TouchPanBlocker.Message': 'Use two fingers to move the map'
// }

// 地图配置
const mapOption = {
  center: [113.416, 22.197], // 中心点
  projection: 'mercator', // mercator | globe
  // pitch: 30,
  zoom: 2,
  maxZoom: 17,
  minZoom: 1,
}

class MapInstance {
  constructor(target = 'map', option = mapOption) {
    // 首次使用构造器实例
    const canvas = document.createElement('canvas')
    !canvas.getContext('webgl2') && alert('浏览器不支持WebGL 2, 请升级或更换浏览器')

    // if (!MapInstance.instance) {
    const map = new Map({
      accessToken:
        'pk.eyJ1IjoiY3N3d3d3IiwiYSI6ImNsN3BobzdlczE4ZTUzd3A5d25qZ25nYnYifQ.oLgZQ0ks2NoDlH0VXlZzTw',
      container: target,
      preserveDrawingBuffer: true, // map's canvas can be exported to a PNG
      // locale, // 本地化文本
      style: {
        version: 8,
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
        sources: {},
        layers: [
          {
            id: '_background',
            type: 'background',
            paint: {
              'background-color': '#000c29',
            },
          },
        ],
      },
      ...option,
    })

    map.dragRotate.disable() // 禁用右键旋转
    map._logoControl && map.removeControl(map._logoControl) // 去除LOGO

    // 监听事件
    map.on('style.load', () => {
      map.setFog({})
      loadBaseLayer(map) // 加载基础图层
    })

    loadLayerGroupsFucntion(map) // 挂载图层组方法

    this.map = map
    MapInstance.instance = this // 将this挂载到MapInstance这个类的instance属性上
    // }
    // return MapInstance.instance
  }
}

// 创建地图
function createMap(
  option = {
    center: [113.416, 22.197],
    projection: 'mercator',
    zoom: 2,
    maxZoom: 17,
    minZoom: 1,
  },
) {
  const singleMap = new Map({
    // locale,
    accessToken:
      'pk.eyJ1IjoiY3N3d3d3IiwiYSI6ImNsN3BobzdlczE4ZTUzd3A5d25qZ25nYnYifQ.oLgZQ0ks2NoDlH0VXlZzTw',
    container: 'map',
    preserveDrawingBuffer: true, // map's canvas can be exported to a PNG
    style: {
      version: 8,
      sources: {},
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#000c29',
          },
        },
      ],
    },
    ...option,
  })
  singleMap.dragRotate.disable() // 禁用右键旋转
  singleMap._logoControl && singleMap.removeControl(singleMap._logoControl)

  singleMap.on('style.load', () => {
    loadBaseLayer(singleMap) // 加载基础图层
  })
  return singleMap
}

export { createMap, MapInstance }
