/**
 * Spins the globe based on the zoom level of the map.
 * ref: https://docs.mapbox.com/mapbox-gl-js/example/globe-spin/
 * 
 * map.once('moveend', () => {
 *   spinGlobe(map) // 地图旋转
 * })
 */

function spinGlobe(map) {
  // map.once('moveend', () => {
  //   spinGlobe(map)
  // })
  const secondsPerRevolution = 120 // At low zooms, complete a revolution every two minutes.
  const maxSpinZoom = 5 // Above zoom level 5, do not rotate.
  const slowSpinZoom = 3 // Rotate at intermediate speeds between zoom levels 3 and 5.

  const zoom = map.getZoom()
  if (zoom < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution
    if (zoom > slowSpinZoom) {
      // Slow spinning at higher zooms
      const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom)
      distancePerSecond *= zoomDif
    }
    const center = map.getCenter()
    center.lng -= distancePerSecond
    map.easeTo({ center, duration: 1000, easing: (n) => n })
  }
}

export {
  spinGlobe
}