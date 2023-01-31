//!/usr/bin/env node

/**
 * 定时任务调度，执行npm run build
 */
const schedule = require('node-schedule');
const exec = require('child_process').exec;

// 每隔30分钟执行一次
const j2 = schedule.scheduleJob('*/30 * * * *', function () {
	console.log('执行单元测试中 ...');

	// exec 执行命令
	exec('npm run test', function (err, stdout, stderr) {
		if (err) {
			console.log(err);
		} else {
			console.log(stdout);
		}
	});
});

// 启动
j2.invoke();
