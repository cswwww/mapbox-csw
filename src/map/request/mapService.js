/*
 * @Date: 2022-10-21 16:34:02
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-09-15 16:44:42
 * @FilePath: \mapbox-re\src\map\request\mapService.js
 * @Description: 地图服务相关方法
 */

// 地图：加载图片
export const loadMapImage = (map, imageUrl, imageId, callback) => {
  if (map.hasImage(imageId)) {
    callback();
  } else {
    map.loadImage(imageUrl, function (error, image) {
      if (error) {
        console.error("图片加载失败:", error);
        return;
      }
      map.addImage(imageId, image);
      callback();
    });
  }
};

// 地图：加载图标（sdf图片）
export const loadMapIcon = (map, imageUrl, imageId, callback) => {
  if (map.hasImage(imageId)) {
    callback();
  } else {
    map.loadImage(imageUrl, function (error, image) {
      if (error) {
        console.error("图片加载失败:", error);
        return;
      }
      map.addImage(imageId, image, { sdf: true });
      callback();
    });
  }
};
