/*
 * @Date: 2024-02-04 16:03:56
 * @LastEditors: ReBeX  cswwww@163.com
 * @LastEditTime: 2024-03-11 15:26:50
 * @FilePath: \satellite-web\src\utils\map\layer\layerGroup.js
 * @Description: 图层 - 组
 */

/**
 * Add a layer group placeholder layer to the map.
 *
 * @param {string} groupId - The ID of the group
 * @return {void}
 */
// function addLayerGroup(groupId) {
//   const map = this
//   // add a layer group placeholder layer
//   const groupPlaceholderLayer = {
//     id: groupId + 'GroupPlaceholder',
//     type: 'background',
//     layout: {
//       visibility: 'none',
//     },
//     metadata: {
//       group: [groupId],
//     },
//   }
//   map.addLayer(groupPlaceholderLayer, null)
// }

/**
 * Retrieves layers from the map that belong to a specific group, or returns unique groups if no groupId is provided.
 *
 * @param {string} groupId - The ID of the group to filter layers by.
 * @return {Array | string} - An array of layers belonging to the specified group, or an array of unique group IDs if no groupId is provided.
 */
function getLayerGroup(groupId) {
  const map = this
  const layers = map.getStyle().layers || []

  if (groupId) {
    return layers.filter(layer => layer.metadata?.group.includes(groupId))
  }

  const uniqueGroups = new Set(layers
    .filter(layer => layer.metadata?.group)
    .map(layer => layer.metadata.group)
    .flat(),
  )
  return Array.from(uniqueGroups)
}

/**
 * Removes all layers belonging to the specified group ID from the map.
 *
 * @param {string} groupId - The ID of the group to remove layers for
 * @return {void}
 */
function removeLayerGroup(groupId) {
  const map = this
  const layers = map.getStyle().layers || []

  layers.forEach((layer) => {
    if (layer.metadata?.group?.includes(groupId)) {
      map.removeLayer(layer.id)
      map.removeSource(layer.id)
    }
  })
}

/**
 * Adds a layer to a group.
 *
 * @param {string} groupId - The ID of the group.
 * @param {string} layerId - The ID of the layer.
 */
function addLayerToGroup(groupId, layerId) {
  const map = this
  const layer = map.getLayer(layerId)
  layer.metadata = {
    ...layer.metadata,
    group: [
      ...layer.metadata.group,
      groupId,
    ],
  }
}

function showLayerGroup(groupId) {
  const map = this
  const layers = map.getStyle().layers || []

  layers.forEach((layer) => {
    if (layer.metadata?.group?.includes(groupId)) {
      this.setLayoutProperty(layer.id, 'visibility', 'visible')
    }
  })
}

function hideLayerGroup(groupId) {
  const map = this
  const layers = map.getStyle().layers || []

  layers.forEach((layer) => {
    if (layer.metadata?.group?.includes(groupId)) {
      this.setLayoutProperty(layer.id, 'visibility', 'none')
    }
  })
}

function loadLayerGroupsFucntion(map) {
  // map.addLayerGroup = addLayerGroup
  map.getLayerGroup = getLayerGroup
  map.removeLayerGroup = removeLayerGroup
  map.addLayerToGroup = addLayerToGroup
  map.showLayerGroup = showLayerGroup
  map.hideLayerGroup = hideLayerGroup
  // mapboxgl.Map.prototype.addLayerGroup = addLayerGroup
}

export { loadLayerGroupsFucntion }
