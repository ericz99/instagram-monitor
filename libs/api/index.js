import request from '../request';
import cheerio from 'cheerio';
import sleep from '../../utils/sleep';
import logger from '../logger';

/**
 *
 * @param {String} user - Username or Email for login
 * @param {String} pass - Password for login
 */
export const loginUser = async (user, pass) => {
  const token = await getCsrfToken();

  const options = {
    uri: 'https://www.instagram.com/accounts/login/ajax/',
    method: 'POST',
    followAllRedirects: true,
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-csrftoken': token,
      'x-ig-app-id': '936619743392459',
      'x-instagram-ajax': '79d0a43d9853',
      'x-requested-with': 'XMLHttpRequest'
    },
    form: {
      username: user,
      password: pass,
      queryParams: {
        source: 'auth_switcher',
        oneTapUsers: ['16848890561']
      },
      optIntoOneTap: true
    }
  };

  const resp = await request(options);

  if (resp.statusCode === 200 && resp.body.authenticated) {
    return true;
  } else {
    return false;
  }
};

export const getCsrfToken = async () => {
  const options = {
    uri: 'https://www.instagram.com/accounts/login',
    method: 'GET'
  };

  const resp = await request(options);
  const jsonObject = JSON.parse(
    resp.body
      .match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1]
      .slice(0, -1)
  );

  if (jsonObject.config.csrf_token !== null) {
    return jsonObject.config.csrf_token;
  }
};

/**
 *
 * @param {array} users - Required an array of users
 * @param {String} proxy - Does not required a proxy, but recommeneded
 */
export const scrapeAllUser = async (users, proxy) => {
  const data = [];

  if (users.length === 0) return Promise.reject('Please add some account you wished to monitor!');

  for (let i = 0; i < users.length; i++) {
    const options = {
      uri: `https://www.instagram.com/${users[i]}/`,
      proxy: proxy !== null ? proxy : null,
      headers: {
        Connection: 'keep-alive',
        'accept-language': 'en-US,en;q=0.9',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
      }
    };

    const resp = await request(options);
    const jsonObject = JSON.parse(
      resp.body
        .match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1]
        .slice(0, -1)
    );

    if (resp.statusCode !== 200) {
      logger('error', 'Rate limit exceeded!');

      return false;
    }

    data.push(jsonObject['entry_data']['ProfilePage'][0].graphql.user);
  }

  return data;
};

/**
 * @param {array} body - Must be an array of response body's
 * @returns {posts} - returns posts
 */
export const scrapeUserPost = async body => {
  const userPost = [];

  for (let i = 0; i < body.length; i++) {
    const {
      edge_owner_to_timeline_media: { edges }
    } = body[i];

    for (let j = 0; j < edges.length; j++) {
      const node = edges[j].node;

      userPost.push({
        postID: node.shortcode,
        displayUrl: node.display_url,
        text: node.edge_media_to_caption.edges[0].node.text,
        isVideo: node.is_video,
        timestamp: node.taken_at_timestamp,
        owner: node.owner
      });
    }
  }

  return userPost;
};

/**
 *
 * @param {array} body - Must be an array of body response
 */
export const scrapeUserData = async body => {
  const data = [];

  for (let i = 0; i < body.length; i++) {
    const node = body[i];

    // get user data
    const userDetail = {
      userID: node.id,
      userName: node.username,
      fullName: node.full_name,
      imageUrl: node.profile_pic_url_hd
    };

    for (let j = 0; j < body[i].edge_owner_to_timeline_media.edges.length; j++) {
      const node = body[i].edge_owner_to_timeline_media.edges[j].node;

      if (node.owner.id === userDetail.userID) {
        data.push({
          ...userDetail,
          post: {
            postID: node.shortcode,
            displayUrl: node.display_url,
            text: node.edge_media_to_caption.edges[0].node.text,
            isVideo: node.is_video,
            timestamp: node.taken_at_timestamp,
            owner: node.owner
          }
        });
      }
    }
  }

  return data;
};

/**
 * query_hash: 30a89afdd826d78a5376008a7b81c205
variables: {"reel_ids":["42792406"],"tag_names":[],"location_ids":[],"highlight_reel_ids":[],"precomposed_overlay":false,"show_story_viewer_list":true,"story_viewer_fetch_count":50,"story_viewer_cursor":"","stories_video_dash_manifest":false}
 */

/**
 *
 * @param {object} post - Post object
 * @returns {Boolean} Returns if the post is a video or not!
 */
export const checkPostIfVideo = async post => {
  if (post['is_video']) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};
