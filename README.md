## Instagram Monitor / Scraper

Instagram monitor / scraper allows you to monitor user(s) activities without searching through the web. Simply follow instruction below to get started!

I have removed story monitor because of several reason, (1). I need to find better solution in dealing with rate limits, (2). I want to also separate both post and story monitor in their own respective repo. I will announce when I will upload the story monitor later.

### Installation

Instagram Monitor / Scraper requires the following...

- [Node.js (LTS Version)](http://nodejs.org/)
- [YarnPKG](https://yarnpkg.com/lang/en/docs/install/#windows-stable)

Quick start:

```bash

# Install dependencies
yarn install

# Run application
yarn run start

# To update code
git pull

# Add stuff in your config.json
{
    "discord": {
        "webhook_url": "<Your webhook>",
        "username": "Instagram Monitor",
        "avatar": "",
        "footertext": "",
        "footericon": ""
    },
    "pollMS": 5000,
    "accounts": ["cybersole", "destroyerbots", "testzhi", "offspringhq", "cncpts"],
    "keywords": ["restock", "*"]
}

```

Features:

```bash

# Ability to monitor any instagram accounts ✅
# Able scrape posts ✅
# OCR reader ✅

```

## Updates:

```bash

9/18/19

# Added better error handling ✅
# Added story monitor ✅

10/25/19

# Updated better error handling ✅
# Removed story monitor ✅ (removed temporary for now)
# Removed needing an account to authenticate ✅ (no need to use your existing account anymore)

```

## Todo:

- [x] Ability to monitor any instagram accounts
- [x] Able scrape posts
- [x] Customizable Discord Embeds
- [x] OCR reader
- [x] Better way to rotate proxies
- [x] Added better error handling

## Note:

- Proxy Timeout is most likely proxy ban, so it will send a 503 status code meaning it failed to request page.
- Rate Limited means status 429, so it will fail to request page.

## Tips

- Recommend using proxies, it should be datacenter because I found out resi get ban very easily. (UNLESS you found unbanned resi proxies then sure.)
- Increasing your proxies pool will strongly avoid proxy timeout + datacenter been doing very good for me.
- Using more proxies, you can simply lower delay. (Go ahead and test first before setting it way low.)

## Bugs?

Feel free to make an issue about any particular errors or bugs such as internal functionality bugs.

## DISCLAIMER

Please do not abuse this script, any abused from this script will result in banned by Instagram. This is meant for only to be used for educational purpose.

## Donate

Staring this repo will do the trick :)

## App Info

### Author

Eric Zhang

### Version

1.0.0

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
