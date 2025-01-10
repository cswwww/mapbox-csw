/*
 * @Date: 2023-12-21 10:20:08
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-05-11 14:15:15
 * @FilePath: \satellite-web\src\utils\map\event\mapMarker.js
 * @Description: 地圖 - 标记点
 * @ref: https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
 */

import { Marker } from 'mapbox-gl'
import { createApp } from 'vue'

/**
 * Creates and adds a marker to the map at the specified lnglat coordinates.
 *
 * @param {any} component - The Vue Component to be rendered in the marker.
 * @param {LngLat} lnglat - The coordinates where the marker will be placed.
 * @param {any} feature - The feature information to be passed to the component.
 * @param {Map} map - The map to which the marker will be added.
 * @return {Marker} The created marker object.
 */
function addComponentMarker(component, lnglat, feature, map) {
  const container = document.createElement('div')
  createApp(component, {
    feature, // 传入信息
  }).mount(container)

  const markerInstance = new Marker({
    // anchor: 'center', // 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' , and 'bottom-right'
    className: 'customize-Marker',
    clickTolerance: 0,
    color: '#3FB1CE',
    draggable: false, // 是否允许拖拽
    element: container, // DOM element to use as a marker. The default is a light blue, droplet-shaped SVG marker.
    occludedOpacity: 0.2, // The opacity of a marker that's occluded by 3D terrain.
    // offset: 10,
    pitchAlignment: 'auto',
    rotation: 0,
    rotationAlignment: 'auto',
    scale: 1,
  })

  markerInstance.setLngLat(lnglat).addTo(map)
  return markerInstance
}

export { addComponentMarker }
