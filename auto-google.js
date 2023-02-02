/**
 * 循环执行 npm run script 相应的脚本，前一个脚本执行完毕后，再执行下一个脚本
 * 要实时输出日志，需要使用 spawn，不要使用调度任务
 */
const fs = require('fs');
const { exec } = require('child_process');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration);

function run() {
  const startTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log(`${startTime} 执行google搜索测试中 ...`);
  exec('npm run test:google', function (err, stdout, stderr) {
		if (err) {
			console.log(err);
		} else {
			console.log(stdout);
		}

		const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
		const diff = dayjs.duration(dayjs(endTime).diff(dayjs(startTime))).asSeconds();
		console.log(`${endTime} 本次google搜索测试已经完成 ... 花费时间: ${diff} 秒`);

    // 让Node进程休眠 30 秒
    setTimeout(() => {
      console.log('等待 30 秒后，再执行下一个脚本');
			// 编写判断n.stop文件是否存在，如果存在，则停止执行
			if (fs.existsSync('./n.stop')) {
				console.log('检测到n.stop文件，停止执行');
				return;
			}
      run();
    }, 30000);
	});
}

run();