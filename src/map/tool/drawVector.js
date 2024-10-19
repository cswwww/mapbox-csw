/*
 * @Date: 2024-01-11 14:33:54
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-10-17 14:30:05
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
      id: "measureLineLayer",
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
      id: "measureDynamicLineLayer",
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
      id: "measurePointLayer",
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

  // 开始测量
  start() {
    this.reset();
    this.init();

    this.map.doubleClickZoom.disable(); // 禁止双击缩放
    this.map.getCanvas().style.cursor = "crosshair"; // 设置鼠标样式

    this.map.on("click", this.addPoint);
    this.map.on("dblclick", this.end);
    this.map.on("mousemove", this.dynamicAction);
  }

  // 结束测量
  end(e) {
    this.addPoint(e);

    this.map.off("click", this.addPoint);
    this.map.off("dblclick", this.end);
    this.map.off("mousemove", this.dynamicAction);

    // this.map.once('click', (e) => {
    //   this.clear()
    //   this.start()
    // })
    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式

    this.callback && this.callback(this.nodeCoordinateList);
  }

  // 清除测量
  clear() {
    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式

    this.map.doubleClickZoom.enable(); // 恢复双击缩放
    this.map.off("click", this.addPoint);
    this.map.off("dblclick", this.end);
    this.map.off("mousemove", this.dynamicAction);

    if (this.map.getSource("measurePointLayer")) {
      this.map.removeLayer("measurePointLayer");
      this.map.removeSource("measurePointLayer");
    }
    if (this.map.getSource("measureLineLayer")) {
      this.map.removeLayer("measureLineLayer");
      this.map.removeSource("measureLineLayer");
    }
    if (this.map.getSource("measureDynamicLineLayer")) {
      this.map.removeLayer("measureDynamicLineLayer");
      this.map.removeSource("measureDynamicLineLayer");
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
      this.map.getSource("measureLineLayer").setData(lineList);
    }

    pointList.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: lngLat,
      },
    });
    this.map.getSource("measurePointLayer").setData(pointList);

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
      this.map.getSource("measureDynamicLineLayer").setData(json);
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
      id: "measureFillLayer",
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
      id: "measurePointLayer2",
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

    if (this.map.getSource("measurePointLayer2")) {
      this.map.removeLayer("measurePointLayer2");
      this.map.removeSource("measurePointLayer2");
    }
    if (this.map.getSource("measureFillLayer")) {
      this.map.removeLayer("measureFillLayer");
      this.map.removeSource("measureFillLayer");
    }
  }

  // 隐藏绘制
  show(flag) {
    if (flag) {
      this.map.setLayoutProperty("measurePointLayer2", "visibility", "visible");
      this.map.setLayoutProperty("measureFillLayer", "visibility", "visible");
    } else {
      this.map.setLayoutProperty("measurePointLayer2", "visibility", "none");
      this.map.setLayoutProperty("measureFillLayer", "visibility", "none");
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
    this.map.getSource("measurePointLayer2").setData(pointList);

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
      this.map.getSource("measureFillLayer").setData(json);
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
      id: "measureLineLayer",
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

  // 结束测量
  end() {
    this.map.off("mousedown", this.addPoint);
    this.map.off("mouseup", this.end);
    this.map.off("mousemove", this.dynamicAction);

    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式
    this.callback && this.callback(this.nodeCoordinateList);
  }

  // 清除测量
  clear() {
    this.map.dragPan.enable(); // 恢复双击缩放
    this.map.off("mousedown", this.addPoint);
    this.map.off("mouseup", this.end);
    this.map.off("mousemove", this.dynamicAction);
    this.map.getCanvas().style.cursor = ""; // 恢复鼠标样式

    if (this.map.getSource("measureLineLayer")) {
      this.map.removeLayer("measureLineLayer");
      this.map.removeSource("measureLineLayer");
    }
  }

  // 隐藏绘制
  show(flag) {
    if (flag) {
      this.map.setLayoutProperty("measureLineLayer", "visibility", "visible");
    } else {
      this.map.setLayoutProperty("measureLineLayer", "visibility", "none");
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
      this.map.getSource("measureLineLayer").setData(lineList);
    }
  }
}
