import fs from 'fs';
import dotenv from 'dotenv';

import { loginUser } from './libs/api';
import { formatProxy } from './libs/proxy';
import config from './config/config.json';
import Task from './libs/task';

dotenv.config();
let tasks = [];

(async () => {
  if (config.accounts.length === 0) throw new Error('Please add accounts you wished to monitor!');

  // read proxies file
  const text = fs.readFileSync('./proxy.txt', 'utf-8');
  const proxies =
    text == ''
      ? []
      : formatProxy(
          text
            .replace(/\r/g, '')
            .trim()
            .split('\n')
        );

  console.log(`Loaded ${proxies.length} proxies!`);
  const authenticated = await loginUser(process.env.IG_USER, process.env.IG_PASS);

  if (authenticated) {
    console.log('Successfully logged into account!');

    for (let i = 0; i < config.accounts.length; i++) {
      tasks.push(new Task(config, config.accounts[i], proxies));
      tasks[i].start();
    }
  }
})();
