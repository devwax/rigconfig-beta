const link_whitelist = []

const master_list = {
  "affiliate_links": [
    { domain: 'cj', tld: ['com'] },
    { domain: 'commissionjunction', tld: ['com'] },
    { domain: 'dpbolvw', tld: ['net'] },
    { domain: 'anrdoezrs', tld: ['net'] },
    { domain: 'jdoqocy', tld: ['com'] },
    { domain: 'tkqlhce', tld: ['com'] },
    { domain: 'kqzyfj', tld: ['com'] },
    { domain: 'linksynergy', tld: ['com'] },
    { domain: 'shareasale', tld: ['com'] },
  ],
  "retailers": [
    { domain: 'newegg', tld: ['com'] },
    { domain: 'amazon', tld: ['com'] },
    { domain: 'ebay', tld: ['com'] },
    { domain: 'walmart', tld: ['com'] },
    { domain: 'bestbuy', tld: ['com'] },
    { domain: 'staples', tld: ['com'] },
    { domain: 'jet', tld: ['com'] },
    { domain: 'superbiiz', tld: ['com'] },
    { domain: 'bhphotovideo', tld: ['com'] },
    { domain: 'outletpc', tld: ['com'] },
    { domain: 'play-asia', tld: ['com'] },
    { domain: 'pcnation', tld: ['com'] },
    { domain: 'frys', tld: ['com'] },
  ],
  "social_media": [
    { domain: 'google', tld: ['com'] },
    { domain: 'facebook', tld: ['com'] },
    { domain: 'twitter', tld: ['com'] },
    { domain: 't', tld: ['co'] },
    { domain: 'instagram', tld: ['com'] },
    { domain: 'twitch', tld: ['tv'] },
    { domain: 'youtube', tld: ['com'] },
    { domain: 'youtu', tld: ['be'] },
    { domain: 'craigslist', tld: ['org'] },
  ],
  "uncategorized": [
    { domain: 'tomshardware', tld: ['com'] },
    { domain: '8ch', tld: ['net'] },
    { domain: '4chan', tld: ['org'] },
    { domain: 'pcpartpicker', tld: ['com'] },
    { domain: 'hardwareforums', tld: ['com'] },
    { domain: 'hardforum', tld: ['com'] },
    { domain: 'overclockers', tld: ['com'] },
  ]
};

// Join all the arrays from above into one.
for (var section in master_list) {
  if (master_list.hasOwnProperty(section)) {
    Array.prototype.push.apply(link_whitelist, master_list[section]);
  }
}

export default link_whitelist
