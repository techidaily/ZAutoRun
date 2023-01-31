import _ from 'lodash';

export async function clickOneAds(visibleFrameList: any[]) {
	let clickSuccess = false;
	try {
		const frame = _.sample(visibleFrameList);

		// 有必要的话，滚动到该iframe的位置
		try {
			const frameElement = await frame.frameElement();
			await frameElement.scrollIntoViewIfNeeded();
		} catch (error) { }

		// 使用
		// 查找iframe 中的内部 div 元素带有属性data-google-av-adk，该元素是广告元素
		const adElementList = await frame.locator('div[data-google-av-adk]').all();
	
		// 随机选择一个广告元素
		const adElement = _.sample(adElementList);
	
		// 点击该广告元素
		await adElement.click();
		clickSuccess = true;
	} catch (error) {}

	return clickSuccess;
}