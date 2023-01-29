import { test, expect, chromium, firefox, webkit } from '@playwright/test';

import fs from 'node:fs';
import { join } from 'node:path';

import { getRandomBrowserResolution } from '../util';


// 去国外代理IP网站，获取最新的代理IP地址列表
// https://www.kuaidaili.com/free/inha/1/
// 测试代理IP是否可用
// 使用代理IP访问https://httpbin.org/ip
// 如果返回的IP地址与代理IP地址相同，则代理IP可用
// 如果返回的IP地址与代理IP地址不同，则代理IP不可用
// 使用代理IP访问https://www.baidu.com/
// 如果返回的页面包含“百度一下，你就知道”，则代理IP可用

// 代理IP地址列表
const proxyList: string[] = [];

// 有效的代理IP地址列表
const validProxyList: string[] = [];

// 声明能够访问YouTube的代理IP地址列表
const youtubeProxyList: string[] = [];


test.describe.configure({ mode: 'serial', timeout: 60 * 1000 * 60  });

test.describe('代理IP测试', () => {
  const viewPortSize = getRandomBrowserResolution();


  test('测试能访问Youtube', async () => {
    let browser;
    try {
      browser = await chromium.launch({
        headless: false,
        proxy: {
          server: 'per-context',
        }
      });

      const context = await browser.newContext({
        proxy: {
          server: `http://127.0.0.1:20172`
        }
      });

      const page = await context.newPage();
      await page.setViewportSize(viewPortSize);
      await page.goto('https://www.youtube.com/');
      await expect(page).toHaveURL('https://www.youtube.com/');
    } catch (error) {
      // console.log(error);
    } finally {
      await browser.close();
    }
  });

  test('执行访问官网网址', async () => {
    let browser;
    try {
      browser = await chromium.launch({
        headless: false,
        proxy: {
          server: 'per-context',
        }
      });

      const context = await browser.newContext({
        proxy: {
          server: `http://127.0.0.1:20172`
        }
      });

      const page = await context.newPage();
      await page.setViewportSize(viewPortSize);

      const url = getOneSiteUrl();
      expect(url).toBeTruthy();

      console.log(`使用代理IP访问：${url}`);
      await page.goto(url);
      await expect(page).toHaveURL(url);

      // 静默等待5秒
      await page.waitForTimeout(5000);

      await runUIActionForSite(page, url);
    } catch (error) {
      // console.log(error);
    } finally {
      await browser.close();
    }
  });
});


test.describe('先找代理IP，然后测试给定网址', () => {
  // 测试可以从代理IP网站获取到代理IP地址列表
  test('可以从代理IP网站获取到代理IP地址列表', async ({ page }) => {
    const tryFns = [
      // tryGetIPsFromKuaidaili,
      tryGetIPsFromProxyhub
    ];

    for await (const fn of tryFns) {
      await fn(page);
    }
  });

  // 测试代理IP是否可用
  test('代理IP是否可用', async () => {
    // 异步循环代理IP地址列表
    let index = 0;
    for await (const proxy of proxyList) {
      // 使用代理IP访问https://httpbin.org/ip
      // 如果返回的IP地址与代理IP地址相同，则代理IP可用
      // 定义用例顺序执行
      let browser;
      try {
        browser = await chromium.launch({
          headless: true,
          proxy: {
            server: 'per-context',
          }
        });

        const context = await browser.newContext({
          proxy: {
            server: `http://${proxy}`
          }
        });

        console.log(`使用代理IP：[${index}/${proxyList.length}] ${proxy}`);
        const page = await context.newPage();
        await page.goto('https://httpbin.org/ip');
        await expect(page).toHaveURL('https://httpbin.org/ip');
        validProxyList.push(proxy);
      } catch (error) {
        // console.log(error);
      } finally {
        index += 1;
        await browser.close();
      }
    }

    // 输出有效的代理IP地址列表
    console.log(validProxyList);

    await expect(validProxyList.length).toBeGreaterThanOrEqual(1);
  });

  test('循环访问Youtube', async () => {
    // 声明能够访问

    let index = 0;
    for await (const proxy of validProxyList) {
      let browser;
      try {
        browser = await chromium.launch({
          headless: true,
          proxy: {
            server: 'per-context',
          }
        });

        const context = await browser.newContext({
          proxy: {
            server: `http://${proxy}`
          }
        });

        console.log(`使用代理IP：[${index}/${proxyList.length}] ${proxy}`);
        const page = await context.newPage();
        await page.goto('https://www.youtube.com/');
        await expect(page).toHaveURL('https://www.youtube.com/');
        youtubeProxyList.push(proxy);
      } catch (error) {
        // console.log(error);
      } finally {
        index += 1;
        await browser.close();
      }

      // 期望能够访问YouTube的代理IP地址数量大于等于1
      await expect(youtubeProxyList.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('随机访问site.txt文件中的一个网址', async () => {
    // 随机获取一个网址
    const site = getOneSiteUrl();

    // 随机获取一个代理IP地址
    const proxy = youtubeProxyList[Math.floor(Math.random() * youtubeProxyList.length)];

    // 使用代理IP访问网址
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        proxy: {
          server: 'per-context',
        }
      });

      const context = await browser.newContext({
        proxy: {
          server: `http://${proxy}`
        }
      });

      const page = await context.newPage();
      const url = getOneSiteUrl();
      expect(url).toBeTruthy();

      await page.goto(url);
      await expect(page).toHaveURL(url);

    } catch (error) {
      // console.log(error);
    } finally {
      await browser.close();
    }

  });


});

function getOneSiteUrl() {
  // 读取网址列表
  const siteList = fs.readFileSync(join(__dirname, 'data/site.txt'), 'utf8').split('\n');

  // 随机获取一个网址
  const site = siteList[Math.floor(Math.random() * siteList.length)];
  return site;
}

async function runUIActionForSite(page: any, site: string) {
  await page.goto(site);
  await expect(page).toHaveURL(site);

  // 定义整体操作用时，最小，最大的区间
  const minTotalTime = 10 * 60 * 1000;
  const maxTotalTime = 20 * 60 * 1000;

  // 生成随机整体操作用时，最小，最大的区间
  const totalTime = Math.floor(Math.random() * (maxTotalTime - minTotalTime)) + minTotalTime;

  // 记录整体操作耗时
  const startTime = new Date().getTime();
  const actionSpec = '<随机UI操作>';
  console.log(`${actionSpec}开始时间：${startTime}, 计划耗时：${totalTime/1000/60} 分钟`);
  // 当整体操作耗时小于10分钟时，执行随机操作
  // while (new Date().getTime() - startTime < totalTime) {
  //   console.log(`正在执行中 ....`)

  // }

  // 声明最大的随机间隔秒数
  const maxRandomIntervalSecs = 10;

  // 声明随机UI操作最大次数
  const maxRandomActionCount = 50;

  // 随机执行UI操作
  const actionCount = Math.floor(Math.random() * maxRandomActionCount) + 1;
  for (let i = 0; i < actionCount; i += 1) {
    // 随机执行鼠标移动，方向不定
    await page.mouse.move(Math.floor(Math.random() * 1920), Math.floor(Math.random() * 1080));
    await page.waitForTimeout(Math.floor(Math.random() * maxRandomIntervalSecs * 1000) + 1000);

    // 随机决定是否滚动鼠标
    if (Math.random() > 0.5) {
      continue;
    }

    // 随机滚动鼠标，方向随机
    await page.mouse.wheel({
      deltaY: Math.floor(Math.random() * 100) * (Math.random() > 0.5 ? 1 : -1)
    });
    await page.waitForTimeout(Math.floor(Math.random() * maxRandomIntervalSecs) + 1000);
  }
  console.log(`${actionSpec}结束时间：${new Date().getTime()}`);


  // 随机查找广告区域，进行点击
  // const adSelector = 'div[role="button"]';
  // const adElement = await page.$(adSelector);
}

async function tryGetIPsFromKuaidaili(page) {
  await page.goto('https://www.kuaidaili.com/free/inha/');
  await expect(page).toHaveTitle(/快代理/);

  // 定位表格
  const table = await page.locator('#list');

  // 获取表格中的所有行
  const rows = await table.locator('tbody tr');

  // 获取表格中的所有行数
  const rowCount = await rows.count();

  await expect(rowCount).toBeGreaterThan(1);

  // 循环每一行，获取每一行中的所有列
  for (let i = 0; i < rowCount; i += 1) {
    const columns = await rows.nth(i).locator('td');
    const columnCount = await columns.count();

    // 获取每一行中的第一列和第二列
    const ip = await columns.nth(0).innerText();
    const port = await columns.nth(1).innerText();

    // 将IP地址和端口号拼接成代理IP地址
    const proxy = `${ip}:${port}`;
    proxyList.push(proxy);
    console.log(proxy);
  }

  await expect(proxyList.length).toBeGreaterThan(1);
}

async function tryGetIPsFromProxyhub(page) {
  await page.goto('https://proxyhub.me/zh/us-free-proxy-list.html');
  await expect(page).toHaveTitle(/ProxyHub.Me/);

  // 定位表格
  const table = await page.locator('#main > div > div.list.table-responsive > table');

  // 获取表格中的所有行
  const rows = await table.locator('tbody tr');

  // 获取表格中的所有行数
  const rowCount = await rows.count();

  await expect(rowCount).toBeGreaterThan(1);

  // 循环每一行，获取每一行中的所有列
  for (let i = 0; i < rowCount; i += 1) {
    const columns = await rows.nth(i).locator('td');
    const columnCount = await columns.count();

    // 获取每一行中的第一列和第二列
    const ip = await columns.nth(0).innerText();
    const port = await columns.nth(1).innerText();
    const type = await columns.nth(2).innerText();

    if (['HTTP', 'HTTPS'].includes(type.toUpperCase( ))) {
      // 将IP地址和端口号拼接成代理IP地址
      const proxy = `${ip}:${port}`;
      proxyList.push(proxy);
      console.log(proxy);
    }


  }

}