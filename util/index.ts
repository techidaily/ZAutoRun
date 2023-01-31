import fs from 'node:fs';
import { join } from 'node:path';

import _ from 'lodash';

// 常用的桌面操作系统的显示器分辨率
export const desktopResolutions = [
  // 屏蔽暂时不需要的分辨率
  // { width: 7680, height: 4320 },
  // { width: 7680, height: 4800 },
  // { width: 7680, height: 4320 },
  // { width: 5120, height: 2880 },
  // { width: 3840, height: 2160 },
  { width: 1920, height: 1080 },
  { width: 1680, height: 1050 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
];

// 常用的移动设备的显示器分辨率
export const mobileResolutions = [
  { width: 2732, height: 2048 },
  { width: 1242, height: 2208 },
  { width: 1242, height: 2688 },
  { width: 1024, height: 1366 },
  { width: 414, height: 896 },
  { width: 414, height: 736 },
  { width: 375, height: 812 },
  { width: 375, height: 667 },
  { width: 360, height: 640 },
  { width: 360, height: 720 },
  { width: 360, height: 760 },
];

// 常用的macOS的显示器分辨率
export const macResolutions = [
  { width: 2560, height: 1600 },
  { width: 2304, height: 1440 },
  { width: 2048, height: 1280 },
  { width: 1920, height: 1200 },
  { width: 1920, height: 1080 },
  { width: 1680, height: 1050 },
  { width: 1440, height: 900 },
];

// 常用的Windows的显示器分辨率
export const windowsResolutions = [
  { width: 3840, height: 2160 },
  { width: 2560, height: 1440 },
  { width: 1920, height: 1080 },
  { width: 1680, height: 1050 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
];

// 常用的浏览器的显示器分辨率
export const browserResolutions = _.uniq([
  ...desktopResolutions,
  ...macResolutions,
  ...windowsResolutions,
  { width: 1920, height: 1080 },
  { width: 1680, height: 1050 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
]);

// 获得一个随机的浏览器分辨率
export function getRandomBrowserResolution() {
  return browserResolutions[Math.floor(Math.random() * browserResolutions.length)];
}

// 随机生成美国地区的地理信息
export function getRandomGeoInfoUS() {
  const latitude = Math.random() * 180 - 90;
  const longitude = Math.random() * 360 - 180;
  return {
    latitude,
    longitude,
    accuracy: 100,
  };
}

// 随机生成英国地区的地理信息
export function getRandomGeoInfoUK() {
  const latitude = Math.random() * 60 - 30;
  const longitude = Math.random() * 60 - 30;
  return {
    latitude,
    longitude,
    accuracy: 100,
  };
}

// 随机生成德国地区的地理信息
export function getRandomGeoInfoDE() {
  const latitude = Math.random() * 60 - 30;
  const longitude = Math.random() * 60 - 30;
  return {
    latitude,
    longitude,
    accuracy: 100,
  };
}

// 随机生成加拿大地区的地理信息
export function getRandomGeoInfoCA() {
  const latitude = Math.random() * 60 - 30;
  const longitude = Math.random() * 60 - 30;
  return {
    latitude,
    longitude,
    accuracy: 100,
  };
}

// 随机生成非中国区的地理信息
export function getRandomBestGeoInfo() {
  const fns = [getRandomGeoInfoUS, getRandomGeoInfoUK, getRandomGeoInfoDE, getRandomGeoInfoCA];
  return fns[Math.floor(Math.random() * fns.length)]();
}

export function getAllMostCommonUserAgents() {
  // const url = 'https://techblog.willshouse.com/2012/01/03/most-common-user-agents/';
  // 从该网站获取相应的爬虫数据, 存储到本文文件 most-common-user-agents.json 中

  // 从本地文件中获取相应的爬虫数据
  const path = join(__dirname, 'most-common-user-agents.json');
  const jsonContent = fs.readFileSync(path, 'utf-8');
  const agents = JSON.parse(jsonContent);
  return agents;
}

// 从互联网站上获取适用于Chrome的最多的User-Agent的列表函数
export function getChromeUserAgent() {
  const agents = getAllMostCommonUserAgents();

  // 从 agents 中获取 Chrome 相关的 User-Agent
  const chromeAgents = agents.filter((agent) => agent.system.includes('Chrome'));

  // 随机获取一个 User-Agent
  const randomIndex = Math.floor(Math.random() * chromeAgents.length);
  const randomAgent = chromeAgents[randomIndex].useragent;
  return randomAgent;
}

// 从常见的User-Agent获取适用于Safari的最多的User-Agent的列表函数
export function getSafariUserAgent() {
  const agents = getAllMostCommonUserAgents();

  // 从 agents 中获取 Safari 相关的 User-Agent
  const safariAgents = agents.filter((agent) => agent.system.includes('Safari'));

  // 随机获取一个 User-Agent
  const randomIndex = Math.floor(Math.random() * safariAgents.length);
  const randomAgent = safariAgents[randomIndex].useragent;
  return randomAgent;
}

// 从常见的User-Agent获取适用于Firefox的最多的User-Agent的函数
export function getFirefoxUserAgent() {
  const agents = getAllMostCommonUserAgents();

  // 从 agents 中获取 Firefox 相关的 User-Agent
  const firefoxAgents = agents.filter((agent) => agent.system.includes('Firefox'));

  // 随机获取一个 User-Agent
  const randomIndex = Math.floor(Math.random() * firefoxAgents.length);
  const randomAgent = firefoxAgents[randomIndex].useragent;
  return randomAgent;
}


export const logUtil = {
  logMouseMove: (...args) => 0 && console.log(...args),
  logMouseClick: (...args) => console.log(...args),
  logMouseDrag: (...args) => console.log(...args),
  logMouseDrop: (...args) => console.log(...args),
  logMouseEnter: (...args) => console.log(...args),
  logMouseLeave: (...args) => console.log(...args),
  logMouseOver: (...args) => console.log(...args),
  logMouseOut: (...args) => console.log(...args),
  logMouseUp: (...args) => console.log( ...args),
  logMouseDown: (...args) => console.log(...args),
  logMouseWheel: (...args) => 0 && console.log(...args),
  debug: (...args) => 0 && console.log(...args),
}

