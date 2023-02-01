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

			// 当前选择的frame所在的索引
			const frameIndex = visibleFrameList.indexOf(frame);
			console.log(`当前选择的广告frame所在的索引: ${frameIndex}`);

			// 使用
			// 查找iframe 中的内部 div 元素带有属性data-google-av-adk，该元素是广告元素
			const adElementList = await frame.locator('div[data-google-av-adk]').all();
			console.log(`广告元素有: ${adElementList.length} 个`);

			if (adElementList.length === 0) {
				continue;
			}

			// 根据数组长度和当前时间戳，编写一个随机选择一个数组元素的算法
			const adElement = _.sample(_.shuffle(adElementList));
			const randomIndex = adElementList.indexOf(adElement);
			console.log(`随机选择的广告元素Index是: ${randomIndex}`);

			// 点击该广告元素
			await adElement.click();

			clickSuccess = true;
			break;
		} catch (error) {}
	}

	return clickSuccess;
}
