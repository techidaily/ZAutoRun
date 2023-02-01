/**
 * 通过 Google 搜索关键字，然后验证搜索结果的标题是否包含关键字
 */

import { chromium, expect, firefox, test, webkit } from '@playwright/test';
import _ from 'lodash';
import fs from 'node:fs';
import { join } from 'node:path';
import {
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

});