/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-09-15 16:46:32
 * @FilePath: \mapbox-re\src\map\layer\fillLayer.js
 * @Description: 图层 - 矢量图层 - 圆
 * @ref: https://docs.mapbox.com/style-spec/reference/layers/#fill
 */

import { VectorLayer } from '../index.js'

/**
 * Creates a new instance of the fillLayer class.
 *
 * @param {type} feature - 矢量要素数据
 * @param {type} layerName - 图层及数据源的名称
 * @param {type} option - 配置项
 * @return {type} null
 */
export class FillLayer extends VectorLayer {
  constructor(feature, layerName, option, map) {
    let options = {
      type: 'fill',
      layout: {
        'fill-sort-key': 1,
        'visibility': 'visible' // "visible", "none"
      },
      paint: {
        'fill-antialias': true,
        'fill-color': '#000000',
        'fill-opacity': 1,
        'fill-outline-color': 'black'
        // 'fill-emissive-strength': 0, // Requires lights Supports
        // 'fill-pattern': 'Name of image',
        // 'fill-translate': [0,0],
        // 'fill-translate-anchor': "map",
      }
    }
    // 对传入的参数则进行处理
    if (option instanceof Object) {
      options = Object.assign(options, option)
    }
    super(feature, layerName, options, map)
  }
}