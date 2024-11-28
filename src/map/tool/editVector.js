/*
 * @Date: 2024-10-16 14:31:38
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-11-08 11:16:41
 * @FilePath: \mapbox-csw\src\map\tool\editVector.js
 * @Description: 编辑矢量
 */
import * as turf from '@turf/turf'

export class EditVector {
  constructor(map) {
    this.map = map
  }
}

/**
 * @description: 多边形裁剪 - 方案一
 * @param {type} poly - 多边形
 * @param {type} line - 线
 * @param {type} tolerance - 容差
 * @param {type} toleranceType - 容差类型
 * @return {type} 裁剪后的多边形
 * @Reference: https://blog.csdn.net/GISShiXiSheng/article/details/121189322
 */
export function polygonCut(
  poly,
  line,
  tolerance = 0.001,
  toleranceType = 'kilometers',
) {
  // 1. 条件判断
  if (poly.geometry === void 0 || poly.geometry.type !== 'Polygon')
    throw '传入的必须为polygon'
  if (
    line.geometry === void 0
    || !line.geometry.type.toLowerCase().includes('linestring')
  ) {
    throw '传入的必须为linestring'
  }
  if (line.geometry.type === 'LineString') {
    if (
      turf.booleanPointInPolygon(
        turf.point(line.geometry.coordinates[0]),
        poly,
      )
      || turf.booleanPointInPolygon(
        turf.point(
          line.geometry.coordinates[line.geometry.coordinates.length - 1],
        ),
        poly,
      )
    ) {
      throw '起点和终点必须在多边形之外'
    }
  }
  // 2. 计算交点，并把线的点合并
  const lineIntersect = turf.lineIntersect(line, poly)
  const lineExp = turf.explode(line)
  for (let i = 0; i < lineExp.features.length - 1; i++) {
    lineIntersect.features.push(
      turf.point(lineExp.features[i].geometry.coordinates),
    )
  }
  // 3. 计算线的缓冲区
  const lineBuffer = turf.buffer(line, tolerance, {
    units: toleranceType,
  })
  // 4. 计算线缓冲和多边形的difference，返回"MultiPolygon"，所以将其拆开
  console.log('lineBuffer: ', lineBuffer)
  console.log('poly: ', poly)

  const _body = turf.difference(turf.featureCollection([poly, lineBuffer]))
  const pieces = []
  if (_body.geometry.type === 'Polygon') {
    pieces.push(turf.polygon(_body.geometry.coordinates))
  }
  else {
    _body.geometry.coordinates.forEach((a) => {
      pieces.push(turf.polygon(a))
    })
  }
  // 5. 处理点数据
  for (const p in pieces) {
    const piece = pieces[p]
    for (const c in piece.geometry.coordinates[0]) {
      const coord = piece.geometry.coordinates[0][c]
      const p = turf.point(coord)
      for (const lp in lineIntersect.features) {
        const lpoint = lineIntersect.features[lp]
        if (turf.distance(lpoint, p, toleranceType) <= tolerance * 2) {
          piece.geometry.coordinates[0][c] = lpoint.geometry.coordinates
        }
      }
    }
  }
  // // 6. 过滤掉重复点
  // for (let p in pieces) {
  //   const coords = pieces[p].geometry.coordinates[0];
  //   pieces[p].geometry.coordinates[0] = filterDuplicatePoints(coords);
  // }
  // 7. 将属性赋予每一个polygon，并处理id
  pieces.forEach((a, index) => {
    a.properties = Object.assign({}, poly.properties)
    a.properties.id += `-${index}`
  })
  return turf.featureCollection(pieces)
}
