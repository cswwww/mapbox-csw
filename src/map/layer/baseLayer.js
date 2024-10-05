/*
 * @Date: 2023-12-20 09:39:13
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-05-13 13:40:09
 * @FilePath: \satellite-web\src\utils\map\layer\baseLayer.js
 * @Description: 图层 - 底图相关
 */

/*
 * 地圖底圖信息。
 * @id - 地图服务提供商
 * @show - 是否显示
 * @preview - 预览图
 * @layer - 图层组
 *   name - 图层id
 *   url - 图层url
 */
const tdtToken = '79949a020e54e2c239631b85e2222d9b' // 0a5eb6c7a016c54112aafab4b0a274ee , 79949a020e54e2c239631b85e2222d9b
const baseLayer = [
  {
    id: '天地图矢量',
    show: false,
    layer: [
      {
        name: '图层',
        url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + tdtToken
      },
      {
        name: '注记',
        url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + tdtToken
      }
    ]
  },
  {
    id: '天地图影像',
    show: true,
    layer: [
      {
        name: '图层',
        url: 'http://t1.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + tdtToken
      },
      {
        name: '注记',
        url: 'http://t1.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + tdtToken
      }
    ]
  }
]

// 加入外部xyz格式的栅格图层
function xyz(url, id, map) {
  map.addLayer({
    type: 'raster',
    id: id,
    source: {
      type: 'raster',
      tiles: [url],
      tileSize: 256 // 分辨率
    },
    metadata: {
      group: ['底图']
    }
  })
}

/**
 * Loads the base layer for the map.
 *
 * @param {Object} map - The map object.
 * @return {undefined} This function does not return a value.
 */
function loadBaseLayer(map) {
  baseLayer.forEach((item) => {
    item.layer.forEach((layer) => {
      const layerName = item.id + layer.name // 图层名称
      xyz(layer.url, layerName, map)
    })
  })
  updateBaseLayer(map) // 更新图层显隐
}

/**
 * Updates the base layer display by controlling the visibility of the layers.
 *
 * @param {Object} map - The map object.
 * @return {undefined} This function does not return a value.
 */
const updateBaseLayer = (map) => {
  baseLayer.forEach((item) => {
    item.layer.forEach((layer) => {
      map.setLayoutProperty(item.id + layer.name, 'visibility', item.show ? 'visible' : 'none') // 控制图层显隐
    })
  })
}

export { baseLayer, loadBaseLayer, updateBaseLayer }
