/*
 * @Date: 2023-12-29 16:24:39
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-07-25 09:51:10
 * @FilePath: \satellite-web\src\utils\map\tool\mapUtils.js
 * @Description: 工具 - 地图工具
 */
import { lineString, length, polygon, area } from '@turf/turf'

/**
 * Calculates the distance between two points on a map.
 *
 * @param {Array} point1 - The coordinates of the first point.
 * @param {Array} point2 - The coordinates of the second point.
 * @return {string} The distance between the two points in kilometers or meters.
 */
export function getPointDistance(point1, point2) {
  let line = lineString([point1, point2])
  let len = length(line)
  if (len < 1) {
    len = Math.round(len * 1000) + 'm'
  } else {
    len = len.toFixed(2) + 'km'
  }
  return len
}

/**
 * Calculates the distance of a line formed by a list of points.
 *
 * @param {Array} pointList - The list of points forming the line.
 * @return {string} The distance of the line in kilometers or meters.
 */
export function getLineDistance(pointList) {
  let line = lineString(pointList)
  let len = length(line)
  if (len < 1) {
    len = Math.round(len * 1000) + 'm'
  } else {
    len = len.toFixed(2) + 'km'
  }
  return len
}

/**
 * Calculates the area of a polygon given a list of points.
 *
 * @param {Array<Array<number>>} pointList - A list of points representing the polygon.
 * @return {string} - The calculated area of the polygon.
 */
export function getPolygonArea(pointList, feature) {
  let pArea = area(feature || polygon([pointList]))
  if (pArea < 10000) {
    pArea = Math.round(pArea) + 'm²'
  } else {
    pArea = (pArea / 1000000).toFixed(2) + 'km²'
  }
  return pArea
}

/**
 * Exports the current map as an image.
 *
 * @param {Object} map - The map object.
 * @param {boolean} download - Whether to download the image or not.
 * @return {string} The data URL of the exported image.
 */
export function exportMap(map = map, download = false) {
  // 获取当前渲染的地图的 Canvas
  const mapCanvas = map.getCanvas()
  const dataURL = mapCanvas.toDataURL('image/png')

  if (download) {
    const link = document.createElement('a')
    link.addEventListener('click', function () {
      link.href = dataURL
      link.download = '当前地图画面.png'
    })
    link.click()
    // 在下载完成后销毁链接元素
    setTimeout(function () {
      URL.revokeObjectURL(link.href)
      link.remove()
    }, 0)
  }
  return dataURL
}

/**
 * Check if the input array is a valid longitude and latitude pair.
 *
 * @param {Array} lngLatArray - The input array to be checked.
 * @return {boolean} true if the input array is a valid longitude and latitude pair, false otherwise.
 */
export function isValidLngLat(lngLatArray) {
  // 检查数组长度是否为2
  if (Array.isArray(lngLatArray) && lngLatArray.length === 2) {
    // 检查数组元素是否都是数字
    if (lngLatArray.every((coord) => typeof coord === 'number' || typeof coord === 'string')) {
      // 经度的范围是 -180 到 180，纬度的范围是 -90 到 90
      const [lng, lat] = lngLatArray
      if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
        return true
      }
    }
  }
  return false
}
