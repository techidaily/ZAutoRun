import { chromium, expect, firefox, test, webkit } from '@playwright/test';
import _ from 'lodash';
import { disableProxy } from "./proxy";

export interface IVisitYoutubeOptions {
	fnGetProxySetting: () => { [key: string]: any };
	disableHeadless: boolean;
	viewPortSize: { width: number; height: number };
	commonUseOptions: { [key: string]: any };
}

export async function checkVisitYoutube(options: IVisitYoutubeOptions) {
	let browserSuccess = false;
	let browser;
	try {
		browser = await chromium.launch({
			headless: options.disableHeadless,
			...disableProxy ? {} : {
				proxy: {
					server: 'per-context'
				}
			}
		});

		const context = await browser.newContext({
			...options.fnGetProxySetting(),
			...options.commonUseOptions
		});

		const url = 'https://www.youtube.com/';

		const page = await context.newPage();
		await page.setViewportSize(options.viewPortSize);
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
}
