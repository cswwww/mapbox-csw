<script setup>
import { createMap, DrawLine } from '@/utils/index.js'

onMounted(() => {
  const mapInstance = createMap()

  mapInstance.on('style.load', () => {
    const drawLine = new DrawLine(mapInstance)
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
