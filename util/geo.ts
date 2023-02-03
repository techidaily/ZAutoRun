import _ from 'lodash';

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

// 根据ip地址定位地理信息，并随机生成一个附近的地理信息
export async function getGeoInfoByIp(ip: string) {
  const url = `http://ip-api.com/json/${ip}`;
  const res = await fetch(url);
  const data = await res.json();
  const { lat, lon } = data;
  const latitude = lat + Math.random() * 0.1 - 0.05;
  const longitude = lon + Math.random() * 0.1 - 0.05;
  return {
    latitude,
    longitude,
    accuracy: 100,
  };
}