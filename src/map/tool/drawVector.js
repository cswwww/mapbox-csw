/*
 * @Date: 2024-01-11 14:33:54
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-10-21 19:40:30
 * @FilePath: \mapbox-re\src\map\tool\drawVector.js
 * @Description: 工具 - 绘制矢量
 */

/**
 * @description: 绘制线
 */
export class DrawLine {
  nodeCoordinateList; // 节点坐标
  pointFeatureCollection; // 点GeoJSON集合
  lineFeatureCollection; // 线GeoJSON集合
  constructor(map, callback) {
    this.map = map;
    this.addPoint = this.addPoint.bind(this);
    this.end = this.end.bind(this);
    this.dynamicAction = this.dynamicAction.bind(this);

    this.callback = callback; // 回调函数
  }
  // 初始化图层
  init() {
    // 添加线图层
    this.map.addLayer({
      id: "_lineLayer",
      type: "line",
      source: {
        type: "geojson",
        data: this.lineFeatureCollection,
      },
      paint: {
        "line-color": "#ffff00",
        "line-width": 2,
        "line-opacity": 1,
        "line-dasharray": [2, 4],
      },
    });

    // 添加动态线图层
    this.map.addLayer({
      id: "_dynamicLineLayer",
      type: "line",
      source: {
        type: "geojson",
        data: this.lineFeatureCollection,
      },
      paint: {
        "line-color": "#ffff00",
        "line-width": 2,
        "line-opacity": 1,
        "line-dasharray": [2, 4],
      },
    });

    // 添加点图层
    this.map.addLayer({
      id: "_pointLayer",
      type: "circle",
      source: {
        type: "geojson",
        data: this.pointFeatureCollection,
      },
      paint: {
        "circle-color": "#ffffff",
        "circle-radius": 3,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffff00",
      },
    });
  }

  // 重置数据
  reset() {
    this.nodeCoordinateList = [];
    this.pointFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    this.lineFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
  }

  // 开始绘制
  start() {
    this.reset();
    this.init();

    this.map.doubleClickZoom.disable(); // 禁止双击缩放
    this.map.getCanvas().style.cursor = "crosshair"; // 设置鼠标样式

    this.map.on("click", this.addPoint);
    this.map.on("dblclick", this.end);
    this.map.on("mousemove", this.dynamicAction);
  }

  // 结束绘制
  end(e) {
    this.addPoint(e);

    this.map.off("click", this.addPoint);
    this.map.off("dblclick", this.end);
    this.map.off("mousemove", this.dynamicAction);

    // this.map.once('click', (e) => { // ! 连续绘制
    //   this.clear()
    //   this.start()
    // })
    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式

    this.callback && this.callback(this.nodeCoordinateList);
  }

  // 清除绘制
  clear() {
    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式

    this.map.doubleClickZoom.enable(); // 恢复双击缩放
    this.map.off("click", this.addPoint);
    this.map.off("dblclick", this.end);
    this.map.off("mousemove", this.dynamicAction);

    if (this.map.getSource("_pointLayer")) {
      this.map.removeLayer("_pointLayer");
      this.map.removeSource("_pointLayer");
    }
    if (this.map.getSource("_lineLayer")) {
      this.map.removeLayer("_lineLayer");
      this.map.removeSource("_lineLayer");
    }
    if (this.map.getSource("_dynamicLineLayer")) {
      this.map.removeLayer("_dynamicLineLayer");
      this.map.removeSource("_dynamicLineLayer");
    }
  }

  // 添加点
  addPoint(e) {
    const lngLat = [e.lngLat.lng, e.lngLat.lat];
    const pointList = this.pointFeatureCollection;
    const lineList = this.lineFeatureCollection;

    if (pointList.features.length > 0) {
      let prev = pointList.features[pointList.features.length - 1];
      lineList.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [prev.geometry.coordinates, lngLat],
        },
      });
      this.map.getSource("_lineLayer").setData(lineList);
    }

    pointList.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: lngLat,
      },
    });
    this.map.getSource("_pointLayer").setData(pointList);

    this.nodeCoordinateList.push(lngLat);
  }

  // 鼠标移动事件
  dynamicAction(e) {
    const pointList = this.pointFeatureCollection;
    const lngLat = [e.lngLat.lng, e.lngLat.lat];
    if (pointList.features.length > 0) {
      const prev = pointList.features[pointList.features.length - 1];
      const json = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [prev.geometry.coordinates, lngLat],
        },
      };
      this.map.getSource("_dynamicLineLayer").setData(json);
    }
  }
}

/**
 * @description: 绘制矩形
 */
export class DrawRectangle {
  map; // 地图对象
  nodeCoordinateList; // 节点坐标
  pointFeatureCollection; // 点GeoJSON集合
  lineFeatureCollection; // 线GeoJSON集合
  polygonFeatureCollection; // 面GeoJSON集合
  constructor(map, callback) {
    this.map = map;
    this.addPoint = this.addPoint.bind(this);
    this.end = this.end.bind(this);
    this.dynamicAction = this.dynamicAction.bind(this);

    this.callback = callback; // 回调函数
  }
  // 初始化图层
  init() {
    // 添加面图层
    this.map.addLayer({
      id: "_fillLayer",
      type: "fill",
      source: {
        type: "geojson",
        data: this.lineFeatureCollection,
      },
      paint: {
        "fill-color": "#ff0000",
        "fill-opacity": 0.3,
      },
    });
    // 添加点图层
    this.map.addLayer({
      id: "_pointLayer2",
      type: "circle",
      source: {
        type: "geojson",
        data: this.pointFeatureCollection,
      },
      paint: {
        "circle-color": "#ffffff",
        "circle-radius": 3,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ff0000",
      },
    });
  }

  // 重置数据
  reset() {
    this.nodeCoordinateList = [];
    this.pointFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    this.lineFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    this.polygonFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
  }

  // 开始绘制
  start() {
    this.reset();
    this.init();

    this.map.doubleClickZoom.disable(); // 禁止双击缩放
    this.map.getCanvas().style.cursor = "crosshair"; // 设置鼠标样式

    this.map.on("click", this.addPoint);
    this.map.on("dblclick", this.end);
    this.map.on("mousemove", this.dynamicAction);
  }

  // 结束绘制
  end(e) {
    this.addPoint(e);

    this.map.off("click", this.addPoint);
    this.map.off("dblclick", this.end);
    this.map.off("mousemove", this.dynamicAction);

    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式
    this.callback && this.callback(this.polygonFeatureCollection);
  }

  // 清除绘制
  clear() {
    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式

    this.map.doubleClickZoom.enable(); // 恢复双击缩放
    this.map.off("click", this.addPoint);
    this.map.off("dblclick", this.end);
    this.map.off("mousemove", this.dynamicAction);

    if (this.map.getSource("_pointLayer2")) {
      this.map.removeLayer("_pointLayer2");
      this.map.removeSource("_pointLayer2");
    }
    if (this.map.getSource("_fillLayer")) {
      this.map.removeLayer("_fillLayer");
      this.map.removeSource("_fillLayer");
    }
  }

  // 隐藏绘制
  show(flag) {
    if (flag) {
      this.map.setLayoutProperty("_pointLayer2", "visibility", "visible");
      this.map.setLayoutProperty("_fillLayer", "visibility", "visible");
    } else {
      this.map.setLayoutProperty("_pointLayer2", "visibility", "none");
      this.map.setLayoutProperty("_fillLayer", "visibility", "none");
    }
  }

  // 添加点
  addPoint(e) {
    const lngLat = [e.lngLat.lng, e.lngLat.lat];
    const pointList = this.pointFeatureCollection;

    pointList.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: lngLat,
      },
    });
    this.map.getSource("_pointLayer2").setData(pointList);

    this.nodeCoordinateList.push(lngLat);
  }

  // 鼠标移动事件
  dynamicAction(e) {
    const pointList = this.pointFeatureCollection;
    const lngLat = [e.lngLat.lng, e.lngLat.lat];

    const len = pointList.features.length;
    if (len > 1) {
      let pts = this.nodeCoordinateList.concat([lngLat]);
      pts = pts.concat([this.nodeCoordinateList[0]]);
      const json = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [pts],
        },
      };
      this.map.getSource("_fillLayer").setData(json);
      this.polygonFeatureCollection = {
        type: "FeatureCollection",
        features: [json],
      };
    }
  }
}

/**
 * @description: 绘制曲线
 */
export class DrawCurve {
  nodeCoordinateList; // 节点坐标
  lineFeatureCollection; // 线GeoJSON集合
  constructor(map, callback) {
    this.map = map;
    this.addPoint = this.addPoint.bind(this);
    this.end = this.end.bind(this);
    this.dynamicAction = this.dynamicAction.bind(this);

    this.callback = callback; // 回调函数
  }
  // 初始化图层
  init() {
    // 添加线图层
    this.map.addLayer({
      id: "_lineLayer2",
      type: "line",
      source: {
        type: "geojson",
        data: this.lineFeatureCollection,
      },
      paint: {
        "line-color": "#ff0000",
        "line-width": 2,
        "line-opacity": 1,
      },
    });
  }

  // 重置数据
  reset() {
    this.nodeCoordinateList = [];
    this.lineFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
  }

  // 开始测量
  start() {
    this.reset();
    this.init();

    this.map.dragPan.disable(); // 禁止双击缩放
    this.map.getCanvas().style.cursor = "crosshair"; // 设置鼠标样式

    this.map.on("mousedown", this.addPoint);
    this.map.on("mouseup", this.end);
    this.map.on("mousemove", this.dynamicAction);
  }

  // 结束绘制
  end() {
    this.map.off("mousedown", this.addPoint);
    this.map.off("mouseup", this.end);
    this.map.off("mousemove", this.dynamicAction);

    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式
    this.callback && this.callback(this.nodeCoordinateList);
  }

  // 清除绘制
  clear() {
    this.map.dragPan.enable(); // 恢复双击缩放
    this.map.off("mousedown", this.addPoint);
    this.map.off("mouseup", this.end);
    this.map.off("mousemove", this.dynamicAction);
    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式

    if (this.map.getSource("_lineLayer2")) {
      this.map.removeLayer("_lineLayer2");
      this.map.removeSource("_lineLayer2");
    }
  }

  // 隐藏绘制
  show(flag) {
    if (flag) {
      this.map.setLayoutProperty("_lineLayer2", "visibility", "visible");
    } else {
      this.map.setLayoutProperty("_lineLayer2", "visibility", "none");
    }
  }

  // 添加点
  addPoint(e) {
    const lngLat = [e.lngLat.lng, e.lngLat.lat];
    this.nodeCoordinateList.push(lngLat);
  }

  // 鼠标移动事件
  dynamicAction(e) {
    const lngLat = [e.lngLat.lng, e.lngLat.lat];
    const lineList = this.lineFeatureCollection;
    const len = this.nodeCoordinateList.length;

    if (this.nodeCoordinateList.length > 0) {
      this.nodeCoordinateList.push(lngLat);
      let prev = this.nodeCoordinateList[len - 1];
      lineList.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [prev, lngLat],
        },
      });
      this.map.getSource("_lineLayer2").setData(lineList);
    }
  }
}
