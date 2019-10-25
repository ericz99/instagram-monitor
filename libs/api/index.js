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
        'upgrade-insecure-requests': 1,
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/72.0.3626.101 Mobile/15E148 Safari/605.1'
      }
    };

    const resp = await request(options);
    if (resp.statusCode !== 200) {
      console.log('Rate limit exceeded! - [429]');

      return false;
    }

    const jsonObject = JSON.parse(
      resp.body
        .match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1]
        .slice(0, -1)
    );

    return jsonObject['entry_data']['ProfilePage'][0].graphql.user;
  } catch (e) {
    console.log('Proxy timeout! - [503]');
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
