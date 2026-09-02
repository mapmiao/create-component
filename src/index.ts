#!/usr/bin/env node

import { run } from './cli/index';

run().catch((err) => {
  const zh = process.env.APP_LANG?.startsWith('zh') || process.env.LANG?.startsWith('zh');
  console.error(zh ? '执行出错:' : 'Error:', err);
  process.exitCode = 1;
});