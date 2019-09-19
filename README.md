## Instagram Monitor / Scraper

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

# Add stuff in your config.json
{
    "mongoUri": "mongodb://localhost/ig-monitor-db",
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

You will need to rename .env.example file into .env

```
IG_USER=yourusernametoaccount
IG_PASS=yourpasswordtoaccount
```

Features:

```bash

# Ability to monitor any instagram accounts ✅
# Able scrape posts & stories ✅
# OCR reader ✅

```

## Updates:

```bash

9/18/19

# Added better error handling ✅
# Added story monitor ✅

```

## Todo:

- [x] Ability to monitor any instagram accounts
- [x] Able scrape stories & posts
- [x] Customizable Discord Embeds
- [x] OCR reader
- [x] Better way to rotate proxies
- [ ] Keyword filter
- [ ] Database Configuration
- [x] Added better error handling

## Tips

- Recommend using proxies, it can be anything but it must be unbanned from instagram.
- Using more proxies, you can simply lower delay. (Go ahead and test first before setting it way low.)

## Note

- I haven't test the story monitor yet, but it should work. If there's any error then please let me know..
- I have plans of revamping this monitor and hoping to improve the speed and ocr.

## Bugs?

Feel free to make an issue about any particular errors or bugs such as internal functionality bugs.

## DISCLAIMER

Please do not abuse this script, any abused from this script will result in banned by Instagram. This is meant for only to be used for educational purpose.

## App Info

### Author

Eric Zhang

### Version

1.0.0

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
