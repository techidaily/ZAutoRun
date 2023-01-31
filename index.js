//!/usr/bin/env node

/**
 * 定时任务调度，执行npm run build
 */
const schedule = require('node-schedule');
const exec = require('child_process').exec;

const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration);

// 每隔20分钟执行一次
const j2 = schedule.scheduleJob('*/20 * * * *', function () {
  const startTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
	console.log(`${startTime} 执行单元测试中 ...`);

	// exec 执行命令
	exec('npm run test', function (err, stdout, stderr) {
		if (err) {
			console.log(err);
		} else {
			console.log(stdout);
		}

		const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
		const diff = dayjs.duration(dayjs(endTime).diff(dayjs(startTime))).asSeconds();
		console.log(`${endTime} 本次单元测试已经完成 ... 花费时间: ${diff} 秒`);
	});
});

// 启动
j2.invoke();
