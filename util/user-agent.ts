import fs from 'node:fs';
import { join } from 'node:path';

import _ from 'lodash';

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