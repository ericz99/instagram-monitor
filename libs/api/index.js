import request from '../request';

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

export const scrapeUser = async (user, proxy) => {
  try {
    const options = {
      uri: `https://www.instagram.com/${user}/`,
      proxy,
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
      console.log('Rate limit exceeded!');

      return false;
    }

    return jsonObject['entry_data']['ProfilePage'][0].graphql.user;
  } catch (e) {
    console.log('Proxy timeout!');
    return false;
  }
};

/**
 *
 * @param {array} body - Must be an array of body response
 */
export const scrapeUserData = async body => {
  const data = [];

  // get user data
  const userDetail = {
    userID: body.id,
    userName: body.username,
    fullName: body.full_name,
    imageUrl: body.profile_pic_url_hd
  };

  for (let i = 0; i < body.edge_owner_to_timeline_media.edges.length; i++) {
    const node = body.edge_owner_to_timeline_media.edges[i].node;

    if (node.owner.id === userDetail.userID) {
      data.push({
        ...userDetail,
        post: {
          postID: node.shortcode,
          displayUrl: node.display_url,
          text: validateText(node.edge_media_to_caption.edges),
          isVideo: node.is_video,
          timestamp: node.taken_at_timestamp,
          owner: node.owner
        }
      });
    }
  }

  return data;
};

/**
 *
 * @param {string} text - text string
 * @returns {Boolean} Returns null if string is not undefined
 */
export const validateText = caption => {
  if (caption.length == 0) {
    return null;
  }

  return caption[0].node.text;
};

/**
 * query_hash: 30a89afdd826d78a5376008a7b81c205
variables: {"reel_ids":["42792406"],"tag_names":[],"location_ids":[],"highlight_reel_ids":[],"precomposed_overlay":false,"show_story_viewer_list":true,"story_viewer_fetch_count":50,"story_viewer_cursor":"","stories_video_dash_manifest":false}
 */

/**
 * https://www.instagram.com/graphql/query/?query_hash=30a89afdd826d78a5376008a7b81c205&variables=%7B%22reel_ids%22%3A%5B%22246493572%22%5D%2C%22tag_names%22%3A%5B%5D%2C%22location_ids%22%3A%5B%5D%2C%22highlight_reel_ids%22%3A%5B%5D%2C%22precomposed_overlay%22%3Afalse%2C%22show_story_viewer_list%22%3Atrue%2C%22story_viewer_fetch_count%22%3A50%2C%22story_viewer_cursor%22%3A%22%22%2C%22stories_video_dash_manifest%22%3Afalse%7D
 *
 */

/**
 *
 * @param {object} story - Story object
 * @returns {Boolean} Returns if the story is a video or not!
 */
export const checkStoryIfVideo = story => {
  if (story['is_video']) {
    return true;
  } else {
    return false;
  }
};

/**
 *
 * @param {Number} id - Requires a userid
 * @returns {Boolean} Returns if user has stories
 */
export const checkForStories = async id => {
  try {
    const options = {
      uri: 'https://www.instagram.com/graphql/query/',
      method: 'GET',
      json: true,
      resolveWithFullResponse: true,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'accept-encoding': 'gzip, deflate, br'
      },
      gzip: true,
      qs: {
        query_hash: '30a89afdd826d78a5376008a7b81c205',
        variables: JSON.stringify({
          reel_ids: [id],
          tag_names: [],
          location_ids: [],
          highlight_reel_ids: [],
          precomposed_overlay: false,
          show_story_viewer_list: true,
          story_viewer_fetch_count: 50,
          story_viewer_cursor: '',
          stories_video_dash_manifest: false
        })
      }
    };

    const resp = await request(options);
    if (resp.statusCode == 200) {
      const jsonBody = resp.body;
      if (jsonBody['data']['reels_media'].length > 0 && jsonBody['status'] == 'ok') {
        return jsonBody['data']['reels_media'][0];
      } else {
        return null;
      }
    }
  } catch (e) {
    console.log('Proxy timeout!');
    return false;
  }
};

/**
 *
 * @param {Array} json - Takes an array of json data
 * @returns {Array} Returns an array of object
 */
export const scrapeStories = async json => {
  const data = [];
  const stories = json['items'];
  const { __typename, followed_by_viewer, requested_by_viewer, ...rest } = json['owner'];

  // # format user data
  const userData = {
    userID: rest.id,
    userName: rest.username,
    imageUrl: rest.profile_pic_url
  };

  if (stories.length > 0) {
    // # there's stuff in the stories
    for (let i = 0; i < stories.length; i++) {
      const story = stories[i];
      const isVideo = checkStoryIfVideo(story);

      // # if not video, then its a picture, then visa versa
      if (!isVideo) {
        data.push({
          ...userData,
          story: {
            storyID: story.id,
            displayUrl: story.display_url,
            isVideo,
            timestamp: story.taken_at_timestamp
          }
        });
      } else {
        data.push({
          ...userData,
          story: {
            storyID: story.id,
            displayUrl: story.video_resources[0].src,
            isVideo,
            timestamp: story.taken_at_timestamp
          }
        });
      }
    }
  }
  // # return stories
  return data;
};
