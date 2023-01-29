
// 常用的桌面操作系统的显示器分辨率
export const desktopResolutions = [
  { width: 7680, height: 4320 },
  { width: 7680, height: 4800 },
  { width: 7680, height: 4320 },
  { width: 5120, height: 2880 },
  { width: 3840, height: 2160 },
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
export const browserResolutions = [
  ...desktopResolutions,
  ...macResolutions,
  ...windowsResolutions,
  { width: 1920, height: 1080 },
  { width: 1680, height: 1050 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
];

// 获得一个随机的浏览器分辨率
export function getRandomBrowserResolution() {
  return browserResolutions[Math.floor(Math.random() * browserResolutions.length)];
}