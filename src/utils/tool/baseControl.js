/*
 * @Date: 2023-12-20 09:39:13
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-02-28 10:48:14
 * @FilePath: \satellite-web\src\utils\map\tool\baseControl.js
 * @Description: 地图 - 控件
 */
import { FullscreenControl, GeolocateControl, NavigationControl, ScaleControl } from 'mapbox-gl'

function loadBaseControl(map, item) {
  const baseControl = [
    {
      id: 'NavigationControl',
      name: '导航控件',
      active: true,
      obj: new NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true,
      }),
    },
    {
      id: 'ScaleControl',
      name: '比例尺控件',
      active: false,
      obj: new ScaleControl({
        maxWidth: 100,
        unit: 'metric', // 'imperial' , 'metric' or 'nautical'
      }),
    },
    {
      id: 'GeolocateControl',
      name: '定位控件',
      active: false,
      obj: new GeolocateControl({
        // 定位
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
    },
    {
      id: 'FullscreenControl',
      name: '全屏控件',
      active: false,
      obj: new FullscreenControl({ container: document.querySelector('body') }),
    },
  ]

  if (!item) {
    baseControl.forEach((item) => {
      if (item.active) {
        map.addControl(item.obj) // 新增控件
      }
    })
    return
  }
  if (item.active) {
    map.addControl(item.obj) // 新增控件
  }
  else {
    map.removeControl(item.obj) // 移除控件
  }
}

export { loadBaseControl }
