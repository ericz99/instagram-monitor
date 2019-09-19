import { scrapeUserData, scrapeUser, scrapeStories, checkForStories } from '../api';
import { getRandomProxy } from '../proxy';
import { sendNotify, sendStoryNotify } from '../notify';
import logger from '../logger';
import ocrReader from '../../utils/ocr';

class Task {
  constructor(config, user, proxies) {
    this._config = config;
    this._proxies = proxies;
    this._user = user;
    this._log = logger(user);
    this._ids = [];
    this._storiesID = [];
    this._intv = null;
    this._intervalCount = 0;
  }

  async start() {
    this._log.green(`Started task!`);

    let f;

    this._intv = setInterval(
      (f = async () => {
        // choose a random proxies per account
        const randomProxy = getRandomProxy(this._proxies);
        // get result of the user account
        const result = await scrapeUser(this._user, randomProxy);
        // check for result
        if (result) {
          // start story monitor
          await this.startStoryMonitor(result);

          // get post data
          const data = await scrapeUserData(result);

          // get all postid
          const getIds = data.map(p => p.post.postID);

          // only push ids if ids array is empty
          if (this._ids.length === 0) this._ids.push(...getIds);

          // filter the new ids if new ids doesn't exist in ids array
          let newIds = getIds.filter(id => this._ids.indexOf(id) == -1);

          if (newIds.length > 0) {
            // get newids post data
            const newPost = data.filter(p => newIds.indexOf(p.post.postID) > -1);

            this._log.yellow('New post found!');

            // concat array together
            this._ids = [...this._ids, ...newIds];

            // notify user webhook
            await sendNotify(this._config, newPost[0]);

            // check if image exist
            if (newPost[0].post.displayUrl) {
              await ocrReader(newPost[0].post.displayUrl);
            }

            this._log.green('Sent notification!');
          }
        } else if (!result) {
          await this.restart();
        }

        this._intervalCount++;
      }),
      this._config.pollMS
    );

    f();
  }

  async restart() {
    this._log.red('Restarting task...');
    clearInterval(this._intv);
    var that = this;
    setTimeout(function() {
      that.start();
    }, 5000);
  }

  async startStoryMonitor(user) {
    const { id } = user;
    // check if stories is available
    const result = await checkForStories(id);
    // check there's stories availble
    if (result !== null) {
      // scrape the stories
      const stories = await scrapeStories(result); // [ array of json object ]

      // get all storyid
      const getIds = stories.map(s => s.story.storyID);

      // only push ids if ids array is empty
      if (this._storiesID.length === 0) this._storiesID.push(...getIds);

      // filter the new ids if new ids doesn't exist in ids array
      let newIds = getIds.filter(id => this._storiesID.indexOf(id) == -1);

      // if new is available
      if (newIds.length > 0) {
        // get newids post data
        const newStory = stories.filter(s => newIds.indexOf(s.story.storyID) > -1);

        this._log.yellow('New story found!');

        // concat array together
        this._storiesID = [...this._storiesID, ...newIds];

        // notify user webhook
        await sendStoryNotify(this._config, newStory[0]);

        // check if image exist
        if (newStory[0].post.displayUrl) {
          await ocrReader(newPost[0].post.displayUrl);
        }

        this._log.green('Sent notification!');
      }
    }
  }
}

export default Task;
