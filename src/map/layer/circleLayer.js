/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-09-15 16:42:19
 * @FilePath: \mapbox-re\src\map\layer\circleLayer.js
 * @Description: 图层 - 矢量图层 - 圆
 * @ref: https://docs.mapbox.com/style-spec/reference/layers/#circle
 */

import { VectorLayer } from '../index.js'

/**
 * Creates a new instance of the CircleLayer class.
 *
 * @param {type} feature - 矢量要素数据
 * @param {type} layerName - 图层及数据源的名称
 * @param {type} option - 配置项
 * @return {type} null
 */
export class CircleLayer extends VectorLayer {
  constructor(feature, layerName, option, map) {
    let options = {
      type: 'circle',
      layout: {
        'circle-sort-key': 1,
        'visibility': 'visible' // "visible", "none"
      },
      paint: {
        'circle-blur': 0,
        'circle-color': '#000000',
        'circle-opacity': 1,
        'circle-radius': 1
        // 'circle-stroke-width': 0.5,
        // 'circle-stroke-color': 'black',
      }
    }
    // 对传入的参数则进行处理
    if (option instanceof Object) {
      options = Object.assign(options, option)
    }
    super(feature, layerName, options, map)
  }
}