<script setup>
import { DrawLine } from '@/map/index.js'
import { Map } from 'mapbox-gl'

onMounted(() => {
  const singleMap = new Map({
    accessToken:
      'pk.eyJ1IjoiY3N3d3d3IiwiYSI6ImNsN3BobzdlczE4ZTUzd3A5d25qZ25nYnYifQ.oLgZQ0ks2NoDlH0VXlZzTw',
    container: 'map',
    preserveDrawingBuffer: true, // map's canvas can be exported to a PNG
    style: {
      version: 8,
      sources: {},
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#000c29',
          },
        },
      ],
    },
    center: [113.416, 22.197],
    projection: 'mercator',
    zoom: 2,
    maxZoom: 17,
    minZoom: 1,
  })

  singleMap.on('style.load', () => {
    singleMap.addLayer({
      type: 'raster',
      id: 'asdasdasd',
      source: {
        type: 'raster',
        tiles: [
          'http://t1.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=79949a020e54e2c239631b85e2222d9b', // 替换为你的本地服务器地址
        ],
        tileSize: 256, // 分辨率
      },
      metadata: {
        group: ['底图'],
      },
    })

    const drawLine = new DrawLine(singleMap)
    drawLine.start()
  })
})
</script>

<template>
  <div id="map" style="width: 100%; height: 100%" />
</template>

<style>
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
}
</style>
