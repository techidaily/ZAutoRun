import { chromium, expect, firefox, test, webkit } from '@playwright/test';
import _ from 'lodash';
import fs from 'node:fs';
import { join } from 'node:path';
import {
	getChromeUserAgent,
	getRandomBestGeoInfo,
	getRandomBrowserResolution,
	logUtil
} from '../util';

// 去国外代理IP网站，获取最新的代理IP地址列表
// https://www.kuaidaili.com/free/inha/1/
// 测试代理IP是否可用
// 使用代理IP访问https://httpbin.org/ip
// 如果返回的IP地址与代理IP地址相同，则代理IP可用
// 如果返回的IP地址与代理IP地址不同，则代理IP不可用
// 使用代理IP访问https://www.baidu.com/
// 如果返回的页面包含“百度一下，你就知道”，则代理IP可用


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

test.describe('使用代理IP访问站点', () => {
  test.skip('验证当前的IP及地理信息', async () => {
    let browserSuccess = false;
		let browser;
		try {
			browser = await chromium.launch({
				headless: disableHeadless,
				proxy: {
					server: 'per-context'
				}
			});

			const context = await browser.newContext({
				proxy: {
					server: `http://127.0.0.1:20172`
				},
				...commonUseOptions
			});

			const url = 'https://www.iplocation.net';

			const page = await context.newPage();
			await page.setViewportSize(viewPortSize);
			await page.goto(url);
			await page.waitForURL(url);
			await expect(page).toHaveURL(url);

			// 静默等待5秒
			await page.waitForTimeout(5 * 1000);

      browserSuccess = true;
		} catch (error) {
			console.log(error);
		} finally {
			await browser.close();
		}

    expect(browserSuccess).toBe(true);
	});

  test('测试能访问Youtube', async () => {
    let browserSuccess = false;
		let browser;
		try {
			browser = await chromium.launch({
				headless: disableHeadless,
				proxy: {
					server: 'per-context'
				}
			});

			const context = await browser.newContext({
				proxy: {
					server: `http://127.0.0.1:20172`
				},
				...commonUseOptions
			});

			const url = 'https://www.youtube.com/';

			const page = await context.newPage();
			await page.setViewportSize(viewPortSize);
			await page.goto(url);
			await page.waitForURL(url);
			await expect(page).toHaveURL(url);

			// 静默等待5秒
      await page.waitForTimeout(_.random(10000, 20000));

      browserSuccess = true;
		} catch (error) {
			console.log(error);
		} finally {
			await browser.close();
		}

    expect(browserSuccess).toBeTruthy();
	});

  test('执行访问官网网址', async () => {
    let browserSuccess = false;
		let browser;
		try {
			browser = await chromium.launch({
				headless: disableHeadless,
				proxy: {
					server: 'per-context'
				}
			});

			const context = await browser.newContext({
				proxy: {
					server: `http://127.0.0.1:20172`
				},
				...commonUseOptions
			});

			const page = await context.newPage();
			await page.setViewportSize(viewPortSize);

			const url = getOneSiteUrl();
			expect(url).toBeTruthy();

			console.log(`使用代理IP访问：${url}`);
			await page.goto(url);
			await page.waitForURL(url);
			await expect(page).toHaveURL(url);

			// 静默等待5秒
			await page.waitForTimeout(_.random(15000, 30000));
      await runUIActionForSite(page);

      browserSuccess = true;
		} catch (error) {
			console.log(error);
		} finally {
			await browser.close();
		}

    expect(browserSuccess).toBeTruthy();
	});
});

function getOneSiteUrl() {
	// 读取网址列表
	const siteList = fs.readFileSync(join(__dirname, 'data/site.txt'), 'utf8').split('\n');

	// 随机获取一个网址
	const site = siteList[Math.floor(Math.random() * siteList.length)];
	return site;
}

async function runUIActionForSite(page: any) {
	// 定义整体操作用时，最小，最大的区间
	const minTotalTime = 8 * 60 * 1000;
	const maxTotalTime = 20 * 60 * 1000;

	// 生成随机整体操作用时，最小，最大的区间
	const totalTime = _.random(minTotalTime, maxTotalTime);

	// 记录整体操作耗时
	const startTime = new Date().getTime();
	const actionSpec = '<随机UI操作>';
	console.log(`${actionSpec}开始时间：${startTime}, 计划耗时：${totalTime / 1000 / 60} 分钟`);

	let lastRunFinishedTime = new Date().getTime();
	let preRuFinishedTime = lastRunFinishedTime;

	// 当整体操作耗时小于10分钟时，执行随机操作
	while (lastRunFinishedTime - startTime < totalTime) {
		console.log(
			`正在执行UI中 .... ${actionSpec}已耗时：${(lastRunFinishedTime - startTime) / 1000 / 60} 分钟`
		);

		// 声明最大的随机间隔秒数
		const maxRandomIntervalSecs = 2;

		// 声明随机UI操作最大次数
		const maxRandomActionCount = 8;

		// 随机执行UI操作
		const actionCount = _.random(1, maxRandomActionCount);

		// 默认鼠标滚动方向为向下
		let scrollDirection = 'down';

		for (let i = 0; i < actionCount; i += 1) {
			// 定义鼠标移动随机最大次数
			const maxRandomMoveCount = 10;

			// 随机执行鼠标移动
			const moveCount = _.random(1, maxRandomMoveCount);
			for (let j = 0; j < moveCount; j += 1) {
				// 随机执行鼠标移动，方向不定
				const moveX = _.random(0, viewPortSize.width);
				const moveY = _.random(0, viewPortSize.height);
				await page.mouse.move(moveX, moveY);
				// 输出日志
				logUtil.logMouseMove(`鼠标移动到：${moveX}, ${moveY}`);
				await page.waitForTimeout(_.random(0, maxRandomIntervalSecs) * 1000);
			}

			// 随机决定是否滚动鼠标
			const disableMouseWheel = Math.random() > 0.5;
			if (disableMouseWheel) {
				continue;
			}

			// 定义鼠标滚动随机最大次数
			const maxRandomWheelCount = 10;

			// 随机执行鼠标滚动
			const wheelCount = _.random(1, maxRandomWheelCount);
			for (let j = 0; j < wheelCount; j += 1) {
				await page.mouse.move(viewPortSize.width / 2, viewPortSize.height / 2);
				const wheelX = _.random(0, viewPortSize.width);
				const wheelY = _.random(0, viewPortSize.height);
				await page.mouse.move(wheelX, wheelY);

				if (scrollDirection === 'down') {
					await page.mouse.wheel(0, Math.floor(Math.random() * 500));
				} else {
					await page.mouse.wheel(0, -Math.floor(Math.random() * 500));
				}

				// 输出日志
				logUtil.logMouseWheel(`滚动到：${wheelX}, ${wheelY}`);
				await page.waitForTimeout(_.random(0, maxRandomIntervalSecs) * 1000);

				// 检测是否已经滚动到页面的底部了，如果是，则鼠标滚动到页面顶部
				const scrollHeight = await page.evaluate(
					() => document.documentElement.scrollHeight || document.body.scrollHeight
				);
				const clientHeight = await page.evaluate(
					() => document.documentElement.clientHeight || document.body.clientHeight
				);
				const scrollTop = await page.evaluate(
					() => document.documentElement.scrollTop || document.body.scrollTop
				);
				if (scrollTop + clientHeight >= scrollHeight) {
					scrollDirection = 'up';
				}
			}
		}
		lastRunFinishedTime = new Date().getTime();

		// 检测用时，是否在设置的时间范围内，如果满足，则查找链接，进行点击
		const minCheckTime = _.random(1, 2) * 1000 * 60;
		if (lastRunFinishedTime - preRuFinishedTime > minCheckTime) {
			preRuFinishedTime = lastRunFinishedTime;

			const selfHostLinks: any[] = []; // 站内链接
			const otherHostLinks: any[] = []; // 站外链接

			// 获得页面中所有的链接
			const links = await page.getByRole('link').all();

			// 便利所有的链接，查找是否有需要点击的链接
			for (let i = 0; i < links.length; i += 1) {
				const link = links[i];
				const href = await link.evaluate((node) => node.href);
				// console.log(`href: <${typeof href}> ${href}`);

				// 链接类似于 https://techidaily.com/picture-file-repair-how-to-fix-corrupted-picture-files-from-honor-80-se-phone/，但不包含 https://techidaily.com/author/techidaily/ 这样的字符
				if (_.isString(href) && href) {
					const found = href.match(/(https?:\/\/)?(www\.)?techidaily\.com\/[a-z0-9-]+/);
					// 计算链接反斜杠的数量，如果大于2，则认为是站外链接
					const slashCount = href.split('/').length;

					// 过滤掉https://techidaily.com/dl- 开头的链接
					const isDownloadUrl = href.startsWith('https://techidaily.com/dl-');

					if (found && found.length > 0 && slashCount < 5 && !isDownloadUrl) {
						// 输出日志
						logUtil.debug(`找到链接：${href}`);
						selfHostLinks.push(link);
					}
				}
			}

			// 广告嵌入在iframe中，需要识别页面中是否有iframe，如果有，则需要点击iframe中的链接
			otherHostLinks.push(...(await detectAdsFrames(page)));

			// 声明一个变量，用来判断耗时已经超过了四分之三
			const progressPer = 0.85;
			const enableClick = new Date().getTime() - startTime >= (totalTime - startTime) * progressPer;

			// 判断耗时是否已经过四分之三，如果是，则退出
			if (enableClick) {
				console.log(`耗时已经过${progressPer}，自动执行点击操作`);
				// 随机Boolean值，如果为true，则点击站内链接，否则点击站外链接
				const enableClickAds = _.random(1, 15) > 3;
				const clickedFrame =
					enableClickAds &&
					otherHostLinks.length > 0 &&
					(await tryClickAdsFrame(page, otherHostLinks));
				if (!clickedFrame) {
					// 随机选择一个链接，进行点击
					await tryClickSelfHostList(selfHostLinks, page);
				}
			}
		}
	}

	console.log(`${actionSpec}结束时间：${new Date().getTime()}`);

	// 静默等待5秒
	await page.waitForTimeout(1000 * 10);
}

async function detectAdsFrames(page: any) {
	const frameList: any[] = [];
	const iframes = await page.frames();
	for (let i = 0; i < iframes.length; i += 1) {
		const iframe = iframes[i];
		const url = iframe.url();

		// 过滤类似于https://googleads.g.doubleclick.net/pagead/html/r20230124/r20110914/zrt_lookup.html?fsb=1#RS-0-&adk=1812271808&client=ca-pub-7571918770474297&fa=8&ifi=9&uci=a!9&xpc=UT4z2tI0iJ&p=https%3A//techidaily.com， 字符串长度要大于100，将iframe中的链接进行保存
		if (_.isString(url) && url) {
			const found = url.match(/(https?:\/\/)?(www\.)?googleads\.g\.doubleclick\.net\/[a-z0-9-]+/);
			if (found && found.length > 0 && url.length > 300) {
				// 输出日志
				logUtil.debug(`找到iframe：${url}`);
				frameList.push(iframe);
			}
		}
	}

	return frameList;
}

async function tryClickSelfHostList(selfHostLinks: any[], page: any) {
	if (selfHostLinks.length > 0) {
		const link = _.sample(selfHostLinks);
		await link.scrollIntoViewIfNeeded();

		const href = await link.evaluate((node) => node.href);
		console.log(`点击链接：${href}`);

		await link.click();
		await page.waitForTimeout(_.random(5, 20) * 1000);
	}
}

async function tryClickAdsFrame(page: any, otherHostLinks: any[]) {
	const scrollHeight = await page.evaluate(
		() => document.documentElement.scrollHeight || document.body.scrollHeight
	);
	const clientHeight = await page.evaluate(
		() => document.documentElement.clientHeight || document.body.clientHeight
	);
	const clientWidth = await page.evaluate(
		() => document.documentElement.clientWidth || document.body.clientWidth
	);
	const scrollTop = await page.evaluate(
		() => document.documentElement.scrollTop || document.body.scrollTop
	);

	// 声明一个变量，用来记录可视的iframe数组
	const visibleFrames: any[] = [];

	// 先检测哪些外部链接的iframe，在可视区域内，如果有，则点击
	for (let i = 0; i < otherHostLinks.length; i += 1) {
		const iframe = otherHostLinks[i];
		const frameElement = await iframe.frameElement();
		const box = await frameElement.boundingBox();
		if (box === null) continue;

		if (box.y > 0 && box.y < clientHeight && box.x > 0 && box.x < clientWidth) {
			visibleFrames.push(iframe);
		}
	}

	// 随机选择一个可见的iframe，进行点击
	if (visibleFrames.length > 0) {
		const iframe = _.sample(visibleFrames);

		// 获得iframe所在的坐标，及尺寸
		const frameElement = await iframe.frameElement();

		// 将iframe滚动到可见区域
		await frameElement.scrollIntoViewIfNeeded();

		// 获得iframe所在的区域
		const box = await frameElement.boundingBox();

		// 将鼠标定位到iframe中
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

		// 在iframe所在的区域，随机选择一个位置，进行点击
		const x = _.random(box.x, box.x + box.width);
		const y = _.random(box.y, box.y + box.height);
		await page.mouse.click(x, y);

		console.log(`点击广告iframe ...`);

		await page.waitForTimeout(_.random(15000, 30000));

		return true;
	}

	return false;
}
