import request from '../request';

export const sendNotify = async (
  { discord: { webhook_url, username, avatar, footertext, footericon } },
  metadata
) => {
  const options = {
    uri: webhook_url,
    method: 'POST',
    json: true,
    body: {
      username,
      avatar_url: avatar !== '' ? avatar : null,
      embeds: [
        {
          author: {
            name: metadata.userName,
            url: `https://www.instagram.com/${metadata.userName}`,
            icon_url: metadata.imageUrl
          },
          title: `${metadata.userName} - Post Link`,
          url: `https://www.instagram.com/p/${metadata.post.postID}`,
          color: 15258703,
          fields: [
            {
              name: 'Caption',
              value: metadata.post.text == null ? '[Post has no caption]' : metadata.post.text
            }
          ],
          image: {
            url: metadata.post.displayUrl
          },
          footer: {
            text: footertext !== '' ? footertext : 'Custom Instagram Monitor v1',
            icon_url: footericon !== '' ? footericon : null
          }
        }
      ]
    }
  };

  await request(options);
};

export const sendStoryNotify = async (
  { discord: { webhook_url, username, avatar, footertext, footericon } },
  metadata
) => {
  const options = {
    uri: webhook_url,
    method: 'POST',
    json: true,
    body: {
      username,
      avatar_url: avatar !== '' ? avatar : null,
      embeds: [
        {
          author: {
            name: metadata.userName,
            url: `https://www.instagram.com/${metadata.userName}`,
            icon_url: metadata.imageUrl
          },
          title: `${metadata.userName} - Story Link`,
          url: `https://www.instagram.com/stories/${metadata.userName}/${metadata.story.storyID}`,
          color: 15258703,
          fields: [
            {
              name: 'isVideo',
              value: metadata.story.isVideo
            },
            {
              name: 'Video Src',
              value: `[Story Link](${metadata.story.videoSrc})`
            }
          ],
          image: {
            url: metadata.story.displayUrl
          },
          footer: {
            text: footertext !== '' ? footertext : 'Custom Instagram Monitor v1',
            icon_url: footericon !== '' ? footericon : null
          }
        }
      ]
    }
  };

  await request(options);
};

export const sendOcr = async (
  { discord: { webhook_url, username, avatar, footertext, footericon } },
  text
) => {
  const options = {
    uri: webhook_url,
    method: 'POST',
    json: true,
    body: {
      username,
      avatar_url: avatar !== '' ? avatar : null,
      embeds: [
        {
          color: 15258703,
          description: text,
          footer: {
            text: footertext !== '' ? footertext : 'OCR Reader',
            icon_url: footericon !== '' ? footericon : null
          }
        }
      ]
    }
  };

  await request(options);
};
