/*
 * @Date: 2024-09-25 15:31:54
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2025-01-10 11:23:39
 * @FilePath: \mapbox-csw\src\components\layerManager\layerMap.js
 * @Description: 图层映射方案
 */

/* ------------------------------ 数据 ------------------------------ */
export const layerMap = [
  {
    name: 'Layer Name', // 图层名称
    id: 'Layer ID', // 图层ID
    jsonURL: 'Layer Resource', // 静态资源名称
    show: true, // 是否显示
    type: 'fill', // 图层类型 fill|line|circle|symbol|image
    opacity: 0.8, // 透明度
    fill: '#091934', // 颜色
    hideInLayerManager: true, // 是否在图层管理器中隐藏
    propertyTable: false, // 是否展示属性表
    clickable: true, // 是否可点击
    group: ['信息图层'], // 图层所属分组
    orderNumber: 5, // 加载顺序
    groupOrder: 1, // 组内文字排序
    layerPathType: 'interface', // 图层路径类型
    label: 0, // 是否具有标签功能
    labelText: '{_showLabel}', // 标签内容
    showLabel: 0, // 是否默认显示标签
    legend: '[{"title":"0.7+","type":"symbol","code":"ice-red","group":"覆冰监测装置图例（覆冰比值）"},{"title":"0.5-0.7","type":"symbol","code":"ice-orange","group":"覆冰监测装置图例（覆冰比值）"},{"title":"0-0.5","type":"symbol","code":"ice-yellow","group":"覆冰监测装置图例（覆冰比值）"},{"title":"0","type":"symbol","code":"ice-blue","group":"覆冰监测装置图例（覆冰比值）"}]',
  },
]

/* ------------------------------ 方法 ------------------------------ */
/**
 * 通过layerMap数组和需要的layerId来匹配layer信息
 * @param {Array} neededLayer - 需要的layerId
 * @param {object} scene - 场景信息
 * @returns {Array} - 匹配的layer信息
 */
export function matchLayer(neededLayer, scene) {
  return layerMap
    .filter(item => neededLayer.some(needed => needed.id === item.name))
    .map((item) => {
      return {
        ...item,
        orderNumber: item.orderNumber || 0, // 批量赋值
        show: neededLayer.find(needed => needed.id === item.name)?.show
          ? neededLayer.find(needed => needed.id === item.name)?.show
          : item.show, // 场景中是否显示
        scene,
      }
    })
    .sort((a, b) => a.orderNumber - b.orderNumber) // 加载排序
}
