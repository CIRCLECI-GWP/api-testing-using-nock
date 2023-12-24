const got = require('got');

const ping = (url, timeout = 6000) => {
    return new Promise(async (resolve, reject) => {
      const urlRule = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');
      if (!urlRule.test(url)) reject('invalid url');
      try {
        await got(url)
          .then(() => resolve(true))
          .catch(() => resolve(false));
        setTimeout(() => {
          resolve(false);
        }, timeout);
      } catch (e) {
        reject(e);
      }
    });
  };


module.exports = {
    ping
}
