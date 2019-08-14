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

## Todo:

- [x] Ability to monitor any instagram accounts
- [x] Able scrape stories & posts (stories not implemented, but soon...)
- [x] Customizable Discord Embeds
- [x] OCR reader
- [x] Better way to rotate proxies
- [ ] Keyword filter
- [ ] Database Configuration
- [x] Add more error handling

## Tips

- I HIGHLY RECOMMEND RUNNING RESIDENTIAL STATIC PROXIES, I never tried datacentre, so you can give it a shot.
- Had good success using [chicooked residential proxies](https://chiproxies.com), and ruunning region resi.
- Running with an actual Instagram Account, will greatly reduced the chance of rate limiting...
- I ran 5000+ without proxies, and it's running smooth. But I still recommend running proxies.
- If you are planning monitor more accounts, increase your delay + add more proxies to avoid getting timeout.
- TEST YOUR DELAY WITH A LOT OF PROXIES, usually you will only need 1 task per proxies, and you can also run lower delays.
- MORE PROXIES = LOWER DELAY :) - but you need good proxies

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
