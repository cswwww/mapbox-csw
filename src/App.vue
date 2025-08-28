<script setup>
import { createMap, DrawLine } from '@/utils/index.js'
import addTyphoonLayer from '@/example/track-typhoon.js'

onMounted(() => {
  const mapInstance = createMap()

  mapInstance.on('style.load', () => {
    const drawLine = new DrawLine(mapInstance)
    drawLine.start()
    addTyphoonLayer(mapInstance)
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
