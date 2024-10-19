/*
 * @Date: 2024-01-13 17:06:20
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-10-19 15:52:08
 * @FilePath: \mapbox-re\src\map\index.js
 * @Description: 地圖相关方法
 */

// ! 地图事件
export { spinGlobe } from "./event/spinGlobe.js"; // 地圖旋轉
export { addImgPopup, addComponentPopup } from "./event/mapPopup.js"; // 地圖气泡
export { addComponentMarker } from "./event/mapMarker.js"; // 地圖標記
export { pointerCursor } from "./event/mouseEvent.js"; // 鼠標事件

// ! 地图方法
// * 实例图层 - 'instance-layerName' : 'instance-heatMapLayer'
export {
  baseLayer,
  loadBaseLayer,
  updateBaseLayer,
} from "./layer/baseLayer.js"; // 底图
export { VectorLayer } from "./layer/vectorLayer.js"; // 矢量图层
export { CircleLayer } from "./layer/circleLayer.js"; // 矢量圆
export { LineLayer } from "./layer/lineLayer.js"; // 矢量线
export { FillLayer } from "./layer/fillLayer.js"; // 矢量面
export { SymbolLayer } from "./layer/symbolLayer.js"; // 矢量符号
export { RasterLayer } from "./layer/rasterLayer.js"; // 栅格影像
export { HighlightLayer } from "./layer/highlightLayer.js"; // 交互 - 高亮图层 （单例）
export { HeatMapLayer, HeatMapLayerInstance } from "./layer/heatmapLayer.js"; // 专题图 - 热力图 （单例）
export { ImageLayer } from "./layer/imageLayer.js"; // 图片图层
export { FillExtrusionLayer } from "./layer/fillExtrusionLayer.js"; // 拔高图层
export { loadLayerGroupsFucntion } from "./layer/layerGroup.js"; // 图层 - 组

// ! 地图工具方法及类
export { DrawRectangle, DrawCurve, DrawLine } from "./tool/drawVector.js"; // 绘制矩形
export { DistanceMeasurement, AreaMeasurement } from "./tool/measureTool.js"; // 测量工具
export {
  getPointDistance,
  getLineDistance,
  getPolygonArea,
  exportMap,
  isValidLngLat,
} from "./tool/mapUtils.js";
export {
  flyToFeature,
  flyToPoint,
  flyToGuangdong,
} from "./tool/fixedAndZoom.js";
export { loadBaseControl } from "./tool/baseControl.js"; // 地图 - 控件

// ! 网络请求
export { loadMapImage, loadMapIcon } from "./request/mapService.js";

// ! 矢量编辑
export { geoUtil, polygonCut } from "./tool/editVector.js";

// ! 数据格式化
export { fixPolygonDirection } from "./tool/dataFormat.js";
