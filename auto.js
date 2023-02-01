/**
 * 循环执行 npm run script 相应的脚本，前一个脚本执行完毕后，再执行下一个脚本
 * 要实时输出日志，需要使用 spawn，不要使用调度任务
 */
const { spawn } = require('child_process');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration);

function run() {
  const startTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log(`${startTime} 执行单元测试中 ...`);

  // spawn 执行命令
  const child = spawn('npm', ['run', 'test:site']);

  child.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  child.on('close', (code) => {
    const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const diff = dayjs.duration(dayjs(endTime).diff(dayjs(startTime))).asSeconds();
    console.log(`${endTime} 本次单元测试已经完成 ... 花费时间: ${diff} 秒`);

    // 等待 30 秒后，再执行下一个脚本
    setTimeout(() => {
      run();
    }, 30000);
  });
}

run();