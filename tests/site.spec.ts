import { chromium, expect, firefox, test, webkit } from '@playwright/test';
import _ from 'lodash';
import fs from 'node:fs';
import { join } from 'node:path';
import {
	getNowTime,
	checkVisitYoutube,
	clickOneAds,
	getChromeUserAgent,
	getRandomBestGeoInfo,
	getRandomBrowserResolution,
	getVisibleFrames,

	disableProxy,
	proxyServer,
	getProxySetting,
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

test.describe.configure({ mode: 'serial', timeout: 60 * 1000 * 60 });

test.describe('使用代理IP访问站点', () => {
	test.skip('验证当前的IP及地理信息', async () => {
		let browserSuccess = false;
		let browser;
		try {
			browser = await chromium.launch({
				headless: disableHeadless,
				...disableProxy ? {} : {
					proxy: {
						server: 'per-context'
					}
				}
			});

			const context = await browser.newContext({
				...getProxySetting(),
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
		await checkVisitYoutube({
			fnGetProxySetting: getProxySetting,
			commonUseOptions: commonUseOptions,
			disableHeadless: disableHeadless,
			viewPortSize: viewPortSize
		});
	});

	test('执行访问官网网址', async () => {
		let browserSuccess = false;
		let browser;
		try {
			browser = await chromium.launch({
				headless: disableHeadless,
				...disableProxy ? {} : {
					proxy: {
						server: 'per-context'
					}
				}
			});

			const context = await browser.newContext({
				...getProxySetting(),
				...commonUseOptions
			});

			const page = await context.newPage();
			await page.setViewportSize(viewPortSize);

			const url = getOnePostUrl();
			expect(url).toBeTruthy();

			console.log(`使用代理IP访问：${url}`);
			await page.goto(url, {	timeout: 60 * 1000});
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


function getOnePostUrl() {
	// 读取网址列表
	const siteList = fs.readFileSync(join(__dirname, 'data/posts.txt'), 'utf8').split('\n');

	const configFile = join(__dirname, 'data/config.cache');

	// 从配置文件data/config.cache,读取访问的网址索引，如果没有该文件就创建
	// 判断文件是否存在，不存在，就创建
	if (!fs.existsSync(configFile)) {
		fs.writeFileSync(
			configFile,
			JSON.stringify({
				postIndex: 0,
				siteIndex: 0
			})
		);
	}

	// dump
	const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
	if (config.postIndex >= siteList.length - 1) {
		config.postIndex = 0;
	} else {
		config.postIndex++;
	}

	// 保存配置文件
	fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

	// 读取网址
	const site = siteList[config.postIndex];
	return site;
}

async function runUIActionForSite(
	page: any,
	options = {
		minTotalTime: 3 * 60 * 1000,
		maxTotalTime: 8 * 60 * 1000
	}
) {
	// 定义整体操作用时，最小，最大的区间
	const minTotalTime = options.minTotalTime;
	const maxTotalTime = options.maxTotalTime;

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
			`正在执行UI中 .... ${actionSpec}已耗时：${(lastRunFinishedTime - startTime) / 1000 } 秒`
		);

		// 声明最大的随机间隔秒数
		const maxRandomIntervalSecs = 3;

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

			// 声明一个变量，用来判断耗时已经超过了
			const progressPer = _.random(0.85, 0.95, true);
			const enableClick = new Date().getTime() - startTime >= (totalTime - startTime) * progressPer;

			// 判断耗时是否已经过了设置的时间，如果是，则执行点击操作
			if (enableClick) {
				console.log(`耗时已经过${_.ceil(progressPer) * 100}%，自动执行点击操作`);
				// 随机Boolean值，如果为true，则点击站内链接，否则点击站外链接
				const enableClickAds = _.random(1, 7) > 3;
				const clickedAds = enableClickAds && (await tryClickAdsFrame(page));
				if (clickedAds) {
					// 获得Context上下文，最新的页面
					const context = await page.context();
					const pages = await context.pages();

					console.log(`当前页面数量：${pages.length}`);

					// 是否对最后一个页面进行操作
					// 暂时不对最后一个页面进行操作
					if (0) {
						const lastPage = _.last(pages);
						if (lastPage) {
							// 等待5秒
							try {
								await runUIActionForSite(lastPage);
							} catch (err) {
								console.error(err);
							}
						}
					}
				} else {
					// 随机选择一个链接，进行点击
					await tryClickSelfHostList(selfHostLinks, page);
				}
			}
		}
	}

	console.log(`${actionSpec}结束时间：${getNowTime()}`);

	// 静默等待5秒
	await page.waitForTimeout(1000 * 10);
}

async function tryClickSelfHostList(selfHostLinks: any[], page: any) {
	if (selfHostLinks.length > 0) {
		const link = _.sample(selfHostLinks);
		await link.scrollIntoViewIfNeeded();

		const href = await link.evaluate((node) => node.href);
		console.log(`点击了站内链接：${href}`);

		await link.click();
		await page.waitForTimeout(_.random(5, 20) * 1000);
	}
}

async function tryClickAdsFrame(page) {
	// 页面需要等待20 - 30秒，才能检测到广告框架
	await page.waitForTimeout(_.random(20, 30) * 1000);
	const frames = await getVisibleFrames(page);
	console.log(`检测到${frames.length}个广告框架`);

	const clicked = await clickOneAds(frames);
	console.log(`点击广告框架：${clicked}`);

	return clicked;
}
