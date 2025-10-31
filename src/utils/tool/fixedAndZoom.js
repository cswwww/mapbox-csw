/*
 * @Date: 2024-01-25 13:50:49
 * @LastEditors: ReBeX cswwwx@gmail.com
 * @LastEditTime: 2025-10-31 11:46:24
 * @FilePath: /mapbox-csw/src/utils/tool/fixedAndZoom.js
 * @Description: 定位與聚焦方法
 */

import { bbox } from '@turf/turf'
import { isValidLngLat } from '../index.js'

/**
 * Fly to the specified feature on the map and fit the map bounds accordingly.
 *
 * @param {object} feature - The feature to fly to
 * @param {object} option - Additional options for the map fit
 * @param {object} map - The map object to fly to the feature on
 */
export function flyToFeature(feature, option, map) {
  const border = bbox(feature) // 獲取feature的經緯度範圍
  if (!isValidLngLat([border[0], border[1]]) || !isValidLngLat([border[2], border[3]])) {
    return
  }
  map.fitBounds(
    // 根據範圍定位
    [
      [border[0], border[1]],
      [border[2], border[3]],
    ],
    {
      // 默认为false，决定了跳转的地图过渡动画
      linear: false,
      // 地图视图跳转后允许的最大缩放级别
      maxZoom: 10,
      // 给定的边界(bounds)的中心相对于地图中心的偏离距离，以像素为单位计量
      offset: [0, 0],
      // 按范围定位后地图容器的内边距
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
      // 动画效果
      animate: true,
      // 动画的持续时间，以毫秒为单位
      duration: 2000,
      ...option,
    },
  )
}

/**
 * Fly to a specific point on the map with customizable options.
 *
 * @param {Array<number>} lngLat - The longitude and latitude of the point to fly to
 * @param {object} option - Customizable options for the fly animation
 * @param {object} map - The map object to fly on
 */
export function flyToPoint(lngLat, option, map) {
  if (!isValidLngLat(lngLat)) {
    console.log('無效的坐標值')
    return
  }
  map.flyTo({
    curve: 1.42,
    speed: 1.2,
    center: lngLat,
    duration: 1000,
    zoom: 10,
    // easing(t) {
    //   return t;
    // },
    // maxDuration: 1000,
    // screenSpeed: 0.1,
    ...option,
    // ...CameraOptions, // https://docs.mapbox.com/mapbox-gl-js/api/properties/#cameraoptions
    // ...AnimationOptions, // https://docs.mapbox.com/mapbox-gl-js/api/properties/#animationoptions
  })
}

/**
 * Pan the map to a specific point with smooth animation
 *
 * @param {Array<number>} lngLat - The longitude and latitude to pan to [lng, lat]
 * @param {object} option - Customizable options for the pan animation
 * @param {number} option.duration - Duration of the animation in milliseconds, default is 1000
 * @param {Array<number>} option.offset - Offset in pixels [x, y], default is [0, 0]
 * @param {boolean} option.essential - Whether the animation is essential for user experience, default is true
 * @param {object} map - The map object to pan
 */
export function panToPoint(lngLat, option, map) {
  if (!isValidLngLat(lngLat)) {
    console.log('無效的坐標值')
    return
  }
  map.panTo(lngLat, {
    duration: 1000,
    offset: [0, 0],
    essential: true,
    ...option,
  })
}

/**
 * Fly to Guangdong province with default settings
 * @param {object} map - The map object to fly on
 */
export function flyToGuangdong(map) {
  map.flyTo({
    curve: 1.42,
    speed: 1.2,
    center: [113.2435, 23.136],
    duration: 1000,
    zoom: 6.5,
  })
}
