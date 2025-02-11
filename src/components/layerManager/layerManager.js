/*
 * @Date: 2025-01-10 11:29:44
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2025-01-10 11:31:31
 * @FilePath: \mapbox-csw\src\components\layerManager\layerManager.js
 * @Description: 图层管理相关方法
 */
import { flyToPoint, HeatMapLayerInstance } from '@/utils'

// 操作：缩放到指定图层
export function zoomToLayer(item, map) {
  if (item?.layer?.features?.features === {} || item?.layer?.features?.features?.length === 0) {
    console.err('该图层暂无数据')
    return
  }

  const { type, center, zoom, layer } = item
  // 缩放到图层
  return type === 'raster' ? flyToPoint(center, { zoom }, map) : layer.flyToLayer()
}

// 操作：修改图层透明度
export function setLayerOpacity(item, value, map) {
  item.opacity = value
  if (item.type === 'fill') {
    map.setPaintProperty(item.id, 'fill-opacity', item.opacity)
  }
  else if (item.type === 'line') {
    map.setPaintProperty(item.id, 'line-opacity', item.opacity)
  }
  else if (item.type === 'circle') {
    map.setPaintProperty(item.id, 'circle-opacity', item.opacity)
  }
  else if (item.type === 'raster') {
    map.setPaintProperty(item.id, 'raster-opacity', item.opacity)
  }
}

// 操作：切换图层显隐
export function toggleLayer(layer, map) {
  if (Array.isArray(layer)) {
    if (layer.every(item => item.show === true)) {
      layer.forEach((item) => {
        item.show = false
        map.setLayoutProperty(item.id, 'visibility', 'none')
      })
    }
    else {
      layer.forEach((item) => {
        item.show = true
        map.setLayoutProperty(item.id, 'visibility', 'visible')
      })
    }
  }
  else {
    layer.show = !layer.show
    map.setLayoutProperty(layer.id, 'visibility', layer.show ? 'visible' : 'none')
  }
}

// 修改图层颜色
export function setLayerFill(item, event, map) {
  if (item.type === 'fill') {
    item.fill = event
    map.setPaintProperty(item.id, 'fill-color', item.fill || 'rgba(0,0,0,0)')
  }
  else if (item.type === 'line') {
    item.fill = event
    map.setPaintProperty(item.id, 'line-color', item.fill || 'rgba(0,0,0,0)')
  }
  else if (item.type === 'circle') {
    item.fill = event
    map.setPaintProperty(item.id, 'circle-color', item.fill || 'rgba(0,0,0,0)')
  }
}

// 绘制热力图，仅点图层可用
export function showHeatMap(item, map) {
  if (new HeatMapLayerInstance(null, null, null, map).sourceID == item.id) {
    new HeatMapLayerInstance(null, null, null, map).removeLayer()
  }
  else {
    new HeatMapLayerInstance(null, null, null, map).updateLayer(
      item.layer.features,
      item.id,
      null,
      map,
    )
  }
}

// 切换图层注记显隐
export function toggleLayerLabel(item) {
  item.showLabel = !item.showLabel

  if (item.labelText) {
    item.layer.showText(item.showLabel, item.labelText, {
      paint: {
        'text-color': item.fill,
      },
      // ! 是否开启注记爬线效果
      // layout: {
      //   'symbol-placement': layer.type === 'line' ? 'line' : 'point' // 'point', 'line', 'line-center'
      // },
      minzoom: 11,
    })
  }
  else {
    item.layer.showText(item.showLabel, item.name)
  }
}

// 获取：图层列表
export function getLayerGroup(layerList) {
  return [
    ...new Set(
      layerList.flatMap(item =>
        item.group ? (Array.isArray(item.group) ? item.group : [item.group]) : null,
      ),
    ),
  ]
    .map((item) => {
      const groupList = layerList.filter(
        layer => (layer.group ? layer.group.includes(item) : layer) && !layer.hideInLayerManager,
      )

      if (groupList.length === 0)
        return
      return {
        groupTitle: item,
        groupList,
      }
    })
    .filter(Boolean)
}
