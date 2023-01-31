import { chromium, expect, firefox, test, webkit } from '@playwright/test';
import _ from 'lodash';
import fs from 'node:fs';
import { join } from 'node:path';
import {
	getChromeUserAgent,
	getRandomBestGeoInfo,
	getRandomBrowserResolution,
	logUtil,
	clickOneAds,
	getVisibleFrames,
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

test.describe.configure({ mode: 'serial', timeout: 60 * 1000 * 60 });

test.describe('debug', () => {
	test('click iframe', async ({ page }) => {
		// 打开一个网站
		await page.goto('https://techidaily.com', {
			waitUntil: 'domcontentloaded',
			timeout: 60 * 1000 * 2
		});
		await page.waitForURL('https://techidaily.com/');
		await page.waitForTimeout(30 * 1000);

		// 获得页面所有的iframe
		const visibleFrameList: any[] = await getVisibleFrames(page);

		// 随机选择一个可见的iframe
		await clickOneAds(visibleFrameList);

		// 等待30秒
		await page.waitForTimeout(30 * 1000);
	});
});


