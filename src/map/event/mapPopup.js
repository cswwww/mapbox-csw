/*
 * @Date: 2023-12-21 10:20:08
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-05-11 14:15:23
 * @FilePath: \satellite-web\src\utils\map\event\mapPopup.js
 * @Description: 地圖 - 气泡弹窗
 * @ref: https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup
 */

import { Popup } from 'mapbox-gl'
import { createApp } from 'vue'

/**
 * Function to add an image popup to the map at a specific location.
 *
 * @param {Object} e - The map event object
 * @param {string} url - The URL of the image
 * @param {Object} map - The map object
 * @param {Object} option - Additional options for the popup
 * @return {Object} The newly created popup
 */

const addImgPopup = (e, url, map, option) => {
  const lngLat = e.features[0].geometry.coordinates.slice() // copy the coordinates

  while (Math.abs(e.lngLat.lng - lngLat[0]) > 180) {
    lngLat[0] += e.lngLat.lng > lngLat[0] ? 360 : -360
  }

  const popup = new Popup({
    // anchor: 'center', // 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' , and 'bottom-right'
    // className: 'customize-popup',
    closeButton: false,
    closeOnClick: true,
    closeOnMove: false,
    focusAfterOpen: false,
    maxWidth: '840px',
    offset: 10,
    ...option
  })

  popup.setLngLat(lngLat).setHTML(`<img class="size-full" src="${url}">`).addTo(map)

  return popup
}

/**
 * Creates and adds a popup to the map at the specified lnglat coordinates.
 *
 * @param {string} component - The component to be rendered in the popup.
 * @param {string} feature - The feature information to be passed to the component.
 * @param {LngLat} lnglat - The coordinates where the popup will be placed.
 * @param {Map} map - The map to which the popup will be added.
 * @return {Popup} The created popup object.
 */
const addComponentPopup = (component, feature, lnglat, map) => {
  const popup = new Popup({
    // anchor: 'center', // 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' , and 'bottom-right'
    className: 'customize-popup',
    closeButton: false,
    closeOnClick: true,
    closeOnMove: false,
    focusAfterOpen: false,
    maxWidth: '240px',
    offset: 10
  })

  const container = document.createElement('div')
  createApp(component, {
    feature // 传入信息
  }).mount(container)

  popup.setLngLat(lnglat).setDOMContent(container).addTo(map)
  return popup
}

export { addImgPopup, addComponentPopup }
