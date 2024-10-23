/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-03-06 15:11:04
 * @FilePath: \satellite-web\src\utils\map\layer\lineLayer.js
 * @Description: 图层 - 矢量图层 - 圆
 * @ref: https://docs.mapbox.com/style-spec/reference/layers/#line
 */

import { VectorLayer } from './vectorLayer'

/**
 * Creates a new instance of the lineLayer class.
 *
 * @param {type} feature - 矢量要素数据
 * @param {type} layerName - 图层及数据源的名称
 * @param {type} option - 配置项
 * @return {type} null
 */
export class LineLayer extends VectorLayer {
  constructor(feature, layerName, option, map) {
    let options = {
      type: 'line',
      layout: {
        'line-cap': 'butt', // "butt", "round", "square"
        'line-join': 'miter', // "bevel", "round", "miter"
        'line-miter-limit': 2, // Requires line-join to be "miter"
        // 'line-round-limit': 1.05, //  Requires line-join to be "round"
        'line-sort-key': 1,
        'visibility': 'visible', // "visible", "none"
      },
      paint: {
        'line-blur': 0,
        'line-color': '#000000',
        // 'line-dasharray': 0,
        'line-gap-width': 0,
        'line-opacity': 1,
        // 'line-gradient': [], '// https://docs.mapbox.com/style-spec/reference/layers/#paint-line-line-gradient
        // 'line-emissive-strength': 0, // Requires lights Supports
        'line-offset': 0,
        // 'line-pattern': 'Name of image',
        // 'line-translate': [0,0],
        // 'line-translate-anchor': "map",
        // 'line-trim-offset': [0, 0], // Requires source to be "geojson"
        'line-width': 1,
      },
    }
    // 对传入的参数则进行处理
    if (option instanceof Object) {
      options = Object.assign(options, option)
    }
    super(feature, layerName, options, map)
  }
}
