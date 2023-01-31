import _ from 'lodash';

export async function clickOneAds(visibleFrameList: any[]) {
	let clickSuccess = false;

	// 对数组进行随机乱序排序
	visibleFrameList = _.shuffle(visibleFrameList);

	// 循环点击广告
	for await (const frame of visibleFrameList) {
		try {
			// 有必要的话，滚动到该iframe的位置
			try {
				const frameElement = await frame.frameElement();
				await frameElement.scrollIntoViewIfNeeded();
			} catch (error) {
				// 容错处理，如果该frame没有frameElement，则不进行滚动
				continue;
			 }

			// 使用
			// 查找iframe 中的内部 div 元素带有属性data-google-av-adk，该元素是广告元素
			const adElementList = await frame.locator('div[data-google-av-adk]').all();
	
			// 随机选择一个广告元素
			const adElement = _.sample(adElementList);
	
			// 点击该广告元素
			await adElement.click();

			clickSuccess = true;
			break;
		} catch (error) {}
	}



	return clickSuccess;
}