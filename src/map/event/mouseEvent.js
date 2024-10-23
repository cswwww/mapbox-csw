/*
 * @Date: 2024-05-14 14:06:15
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-05-15 11:28:20
 * @FilePath: \satellite-web\src\utils\map\event\mouseEvent.js
 * @Description: 地图事件 - 鼠标相关事件
 */

// 鼠标移动事件监听器
function pointerCursor(map, layerName) {
  map.on('mousemove', layerName, () => {
    map.getCanvas().style.cursor = 'pointer' // 改变鼠标指针样式为点
  })

  // 鼠标移出事件监听器
  map.on('mouseleave', layerName, () => {
    map.getCanvas().style.cursor = '' // 恢复鼠标指针样式为默认值
  })
}

export { pointerCursor }
