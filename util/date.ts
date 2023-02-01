import dayjs from 'dayjs';

// 获取当前时间的友好格式
export function getNowTime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

// 根据时间戳获取友好格式
export function getFriendlyTime(timestamp: number) {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
