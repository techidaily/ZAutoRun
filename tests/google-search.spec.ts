/**
 * 通过 Google 搜索关键字，然后验证搜索结果的标题是否包含关键字
 */

import { chromium, expect, firefox, test, webkit } from '@playwright/test';
import _ from 'lodash';
import fs from 'node:fs';
import { join } from 'node:path';
import {
  checkVisitYoutube,
	clickOneAds,
	getChromeUserAgent,
	getRandomBestGeoInfo,
	getRandomBrowserResolution,
	getVisibleFrames,
	logUtil
} from '../util';

const viewPortSize = getRandomBrowserResolution();
/* 地理位置信息 */
const geolocation = getRandomBestGeoInfo();
/* UserAgent */
const userAgent = getChromeUserAgent();

const disableHeadless = true;

const commonUseOptions = {
	geolocation: geolocation,
	userAgent: userAgent,
	viewport: viewPortSize,
	locale: 'en-US'
};

// 打印常用的配置信息
console.log('commonUseOptions: ', commonUseOptions);

const proxyServer = process.env?.TEST_ENV ?? `http://127.0.0.1:20172`;

test.describe.configure({ mode: 'serial', timeout: 60 * 1000 * 60 });

test.describe('使用代理IP访问站点', () => {
	test('测试能访问Youtube', async () => {
		await checkVisitYoutube({
			proxyServer: proxyServer,
			commonUseOptions: commonUseOptions,
			disableHeadless: disableHeadless,
			viewPortSize: viewPortSize
		});
  });

  test('测试通过Google搜索进入站点页面', async () => {
    await test.step('打开Google', async () => { });
    await test.step('搜索关键字', async () => { });
    await test.step('验证搜索结果', async () => { });
    await test.step('查找复合要求的搜索结果', async () => { });
    await test.step('点击搜索结果', async () => { });
    await test.step('验证页面', async () => { });
    await test.step('页面内操作', async () => { });
    await test.step('关闭页面', async () => { });
    await test.step('关闭浏览器', async () => { });
  });
});