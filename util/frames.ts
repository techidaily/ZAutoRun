
import _ from 'lodash';

export async function getVisibleFrames(page, onlyGoogleAds = true) {
	const frames = page.frames();

	const visibleFrameList: any[] = [];

	for await (const frame of frames) {
		try {
			// 获得该frame的在页面中的位置及大小
			const frameElement = await frame.frameElement();
			const frameRect = await frameElement.boundingBox();
      const isVisible = await frameElement.isVisible();

      let isGoogleAds = false;
      const url = frame.url();
      if (_.isString(url) && url) {
        const found = url.match(/(https?:\/\/)?(www\.)?googleads\.g\.doubleclick\.net\/[a-z0-9-]+/);
        isGoogleAds = !!(found && found.length > 0 && url.length > 300);
      }

      if (onlyGoogleAds && !isGoogleAds) continue;

			// 如果该frame在页面中可见，则加入到可见的frame列表中
			if (frameRect && isVisible) {
				if (frameRect.width > 0 && frameRect.height > 0) {
					visibleFrameList.push(frame);
				}
			}
		} catch (error) {
			console.log('error: ', error);
		}
	}
	return visibleFrameList;
}