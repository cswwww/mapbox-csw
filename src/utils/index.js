/*
 * @Date: 2024-01-13 17:06:20
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-12-03 13:55:44
 * @FilePath: \mapbox-csw\src\map\index.js
 * @Description: 地圖相关方法
 */

export { createMap, MapInstance } from './createMapbox.js'
export { addComponentMarker } from './event/mapMarker.js' // 地圖標記
export { addComponentPopup, addImgPopup } from './event/mapPopup.js' // 地圖气泡
export { pointerCursor } from './event/mouseEvent.js' // 鼠標事件
export { spinGlobe } from './event/spinGlobe.js' // 地圖旋轉
export {
  baseLayer,
  loadBaseLayer,
  updateBaseLayer,
} from './layer/baseLayer.js' // 底图
export { CircleLayer } from './layer/circleLayer.js' // 矢量圆
export { FillExtrusionLayer } from './layer/fillExtrusionLayer.js' // 拔高图层
export { FillLayer } from './layer/fillLayer.js' // 矢量面
export { HeatMapLayer, HeatMapLayerInstance } from './layer/heatmapLayer.js' // 专题图 - 热力图 （单例）
export { HighlightLayer } from './layer/highlightLayer.js' // 交互 - 高亮图层 （单例）
export { ImageLayer } from './layer/imageLayer.js' // 图片图层
export { loadLayerGroupsFucntion } from './layer/layerGroup.js' // 图层 - 组
export { LineLayer } from './layer/lineLayer.js' // 矢量线
export { RasterLayer } from './layer/rasterLayer.js' // 栅格影像
export { SymbolLayer } from './layer/symbolLayer.js' // 矢量符号
export { VectorLayer } from './layer/vectorLayer.js' // 矢量图层
export { loadMapIcon, loadMapImage } from './request/mapService.js' // 网络请求
export { loadBaseControl } from './tool/baseControl.js' // 地图 - 控件
export { fixPolygonDirection } from './tool/dataFormat.js' // 数据格式化
export { DrawCurve, DrawLine, DrawRectangle } from './tool/drawVector.js' // 绘制矩形
export { polygonCut } from './tool/editVector.js' // 矢量编辑
export {
  flyToFeature,
  flyToGuangdong,
  flyToPoint,
} from './tool/fixedAndZoom.js'
export {
  exportMap,
  getLineDistance,
  getPointDistance,
  getPolygonArea,
  isValidLngLat,
} from './tool/mapUtils.js'
export { AreaMeasurement, DistanceMeasurement } from './tool/measureTool.js' // 测量工具
