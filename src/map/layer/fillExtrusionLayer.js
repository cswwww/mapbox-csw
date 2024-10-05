/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-09-15 16:46:28
 * @FilePath: \mapbox-re\src\map\layer\fillExtrusionLayer.js
 * @Description: 图层 - 矢量图层 - 带高程的面
 * @ref: https://docs.mapbox.com/style-spec/reference/layers/#fill-extrusion
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
export class FillExtrusionLayer extends VectorLayer {
  // TODO 未完成
  constructor(feature, layerName, option, map) {
    let options = {
      type: 'fill-extrusion',
      paint: {
        'fill-extrusion-color': '#000000',
        'fill-extrusion-height': ['get', 'Height']
      }
    }
    // 对传入的参数则进行处理
    if (option instanceof Object) {
      options = Object.assign(options, option)
    }
    super(feature, layerName, options, map)
  }
}
