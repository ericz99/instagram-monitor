import fs from 'fs';
import dotenv from 'dotenv';

import { scrapeAllUser, scrapeUserData, loginUser } from './libs/api';
import { formatProxy, getRandomProxy } from './libs/proxy';
import { sendNotify } from './libs/notify';
import config from './config/config.json';
import logger from './libs/logger';
import sleep from './utils/sleep';
import ocrReader from './utils/ocr';

dotenv.config();
// Upload post id to array
let ids = [];

// Start up function
(async () => {
  logger('info', 'Starting up instagram monitor!');

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

  const authenticated = await loginUser(process.env.IG_USER, process.env.IG_PASS);

  // if login is successful
  if (authenticated) {
    logger('success', 'Successfully logged into account!');

    let interval = setInterval(async () => {
      // get result of the user account
      const result = await scrapeAllUser(config.accounts, getRandomProxy(proxies));

      if (result.length > 0) {
        // get post data
        const data = await scrapeUserData(result);

        // get all postid
        const getIds = data.map(p => p.post.postID);

        // only push ids if ids array is empty
        if (ids.length === 0) ids.push(...getIds);

        // filter the new ids if new ids doesn't exist in ids array
        let newIds = getIds.filter(id => ids.indexOf(id) == -1);

        if (newIds.length > 0) {
          // get newids post data
          const newPost = data.filter(p => newIds.indexOf(p.post.postID) > -1);

          logger('warn', 'New post found!');

          // concat array together
          ids = [...ids, ...newIds];

          // notify user webhook
          await sendNotify(config, newPost[0]);

          // check if image exist
          if (newPost[0].post.displayUrl) {
            await ocrReader(newPost[0].post.displayUrl);
          }

          logger('success', 'Sent notification!');
        }
      } else if (!result) {
        logger('warn', 'Sleeping for 5000 ms!');

        await sleep(5000);
      }
    }, config.pollMS);
  }
})();
