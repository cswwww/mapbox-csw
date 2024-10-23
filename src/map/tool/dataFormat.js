/*
 * @Date: 2024-10-19 15:24:58
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-10-19 16:12:08
 * @FilePath: \mapbox-re\src\map\tool\dataFormat.js
 * @Description: 数据格式化
 */

// 计算多边形的有向面积
function calculateSignedArea(coordinates) {
  const n = coordinates.length
  let signedArea = 0

  for (let i = 0; i < n; i++) {
    const [x1, y1] = coordinates[i]
    const [x2, y2] = coordinates[(i + 1) % n]
    signedArea += x1 * y2 - x2 * y1
  }

  return signedArea / 2
}

// 纠正多边形方向
export function fixPolygonDirection(polygon) {
  polygon.coordinates.forEach((ring, index) => {
    if (
      (index === 0 && calculateSignedArea(ring) < 0)
      || (index > 0 && calculateSignedArea(ring) > 0)
    ) {
      // 外边界应该是逆时针方向，孔洞应该是顺时针方向
      polygon.coordinates[index].reverse()
      // polygon.coordinates[index].slice().reverse();
    }
  })
}
