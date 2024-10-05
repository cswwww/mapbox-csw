/*
 * @Date: 2023-12-21 14:49:31
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-05-07 11:31:45
 * @FilePath: \satellite-web\src\utils\map\layer\symbolLayer.js
 * @Description: 图层 - 矢量图层 - 符号
 * @ref: https://docs.mapbox.com/style-spec/reference/layers/#symbol
 */

import { VectorLayer } from './vectorLayer'
// import { mainStore } from '@/stores'
// const store = mainStore()

/**
 * Creates a new instance of the SymbolLayer class.
 *
 * @param {type} feature - 矢量要素数据
 * @param {type} layerName - 图层及数据源的名称
 * @param {type} option - 配置项
 * @return {type} null
 */
export class SymbolLayer extends VectorLayer {
  constructor(feature, layerName, option, map) {
    let options = {
      type: 'symbol',
      layout: {
        'icon-image': 'Name of image',
        'icon-allow-overlap': false, // Requires icon-image.
        'icon-anchor': 'center', // "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"
        'icon-ignore-placement': false,
        'icon-keep-upright': false,
        'icon-offset': [0, 0],
        'icon-optional': false,
        'icon-padding': 2, // greater than or equal to 0
        'icon-pitch-alignment': 'auto', // "auto", "map", "viewport"
        'icon-rotate': 0,
        'icon-rotation-alignment': 'auto', // "auto", "map", "viewport"
        'icon-size': 1,
        'icon-text-fit': 'none', // "none", "width", "height", "both"
        // 'icon-text-fit-padding': [0,0,0,0], //  Requires icon-text-fit to be "both", or "width", or "height".
        'symbol-avoid-edges': false,
        'symbol-placement': 'point', // "point", "line"
        // 'symbol-sort-key': 0,
        // 'symbol-spacing': 250, // Requires symbol-placement to be "line"
        // 'symbol-z-elevate': false,
        // 'symbol-z-order': 'auto', // "auto", "viewport-y", "source"
        'text-allow-overlap': false, // Requires text-field.
        'text-anchor': 'center', // "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"
        'text-field': '', // !
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-ignore-placement': false,
        'text-justify': 'center', // "auto", "left", "center", "right"
        // 'text-keep-upright': false,
        'text-letter-spacing': 0,
        'text-line-height': 1.2,
        'text-max-angle': 45,
        'text-max-width': 10,
        'text-offset': [0, 0],
        'text-optional': false,
        'text-padding': 2, // greater than or equal to 0
        'text-pitch-alignment': 'auto', // "auto", "map", "viewport"
        'text-radial-offset': 0,
        'text-rotate': 0,
        'text-rotation-alignment': 'auto', // "auto", "map", "viewport"
        'text-size': 16,
        'text-transform': 'none', // "none", "uppercase", "lowercase"
        // 'text-variable-anchor': "center",
        'text-writing-mode': 'horizontal', // "horizontal", "vertical", "cubic"
        visibility: 'visible' // "visible", "none"
      },
      paint: {
        'icon-color': '#000000',
        'icon-emissive-strength': 1, // Requires lights.
        'icon-halo-blur': 0,
        'icon-halo-color': 'rgba(0, 0, 0, 0)',
        'icon-halo-width': 0,
        'icon-image-cross-fade': 0, // between 0 and 1 inclusive.
        'icon-opacity': 1,
        'icon-translate': [0, 0],
        'icon-translate-anchor': 'map', // One of "map", "viewport".
        'text-color': '#000000',
        'text-emissive-strength': 1, // Requires lights.
        'text-halo-blur': 0,
        'text-halo-color': 'rgba(0, 0, 0, 0)',
        'text-halo-width': 0,
        'text-opacity': 1,
        'text-translate': [0, 0],
        'text-translate-anchor': 'map' // One of "map", "viewport".
      }
    }
    // 对传入的参数则进行处理
    if (option instanceof Object) {
      options = Object.assign(options, option)
    }
    super(feature, layerName, options, map)
  }
}
