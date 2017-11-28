var UrlPattern = require('url-pattern');
import { slugify } from '/imports/api/lib/slugify.js';
import link_whitelist from '/imports/api/lib/link_whitelist.js';

export function whitelistLink(href, title, text) {
  var url_pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/*)');

  const in_whitelist_response = in_whitelist(link_whitelist, url_pattern, href, title, text);

  if (in_whitelist_response.match !== false) {
    anchor = in_whitelist_response.anchor
  } else {
    anchor = in_whitelist_response.link
  }

  return anchor;
}

function in_whitelist(whitelist, pattern, link, title, text) {
  var is_in_list = {
    domain: false,
    tld: false
    // path_match: true
  };
  var matched_segments = pattern.match(link)

  whitelist.map(function (rule) {
    // domain
    if (rule.domain === matched_segments.domain) {
      is_in_list.domain = true
    }

  // tld(s)
  if (is_in_list.domain === true && matched_segments.tld.indexOf(rule.tld)) {
    // console.log('indexOf: %s, matched_segments.tld: %s, rule.tld: %s', matched_segments.tld.indexOf(rule.tld), matched_segments.tld, rule.tld );
    is_in_list.tld = true
  }

  })

  var return_val = {
    match: false,
    link: link,
    anchor: ''
  }

  if (is_in_list.domain === true && is_in_list.tld === true) {
    return_val.match = true
  }

  // Link mutation
  // e.g. http://www.dpbolvw.net/click-4240873-3215923
  // @todo
  //      - Account for multiple links / patterns (an object of patterns to match included via external file)
  //      - The random mutation (mutated_link) to rotate aff ids fires on client and server so has the opportunity to
  //        generate different content on server (ssr) than client. This triggers a warning in console when it happens.
  //        This can be resolved in the future when we transition to better state management w/ flux or redux.
  var rc_id_cj = '0000001'
  var cj_url_pattern = new UrlPattern('(:scheme\\://)(:subdomain.)dpbolvw.:tld/click-:sid-:dest');
  var segments = cj_url_pattern.match(link)
  if (segments !== null) {
    segments.sid = rc_id_cj
    var mutated_link = cj_url_pattern.stringify(segments)
    if (Math.random() < 0.5) {
      return_val.link = mutated_link
    }
  }

  return_val.anchor = `<a href="${return_val.link}" target="${slugify(title || text)}">${title || text}</a>`;

  return return_val
}
