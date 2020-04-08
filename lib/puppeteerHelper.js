module.exports = puppeteerHelper;

const TIMEOUT_MS = 60000;

/**
 * Return the innerHTML string of a web page using puppeteer.
 * @param {Object} param0 Puppeteer 'page' instance, url, and index (e.g. { page, url, index })
 * @returns {Object} Object with body, URL, and index (e.g. {body, url, index})
 */
async function puppeteerHelper({page, url, index}) {
  return new Promise(async function(resolve, _reject) {
    try {
      await page.goto(url, true, {timeout: TIMEOUT_MS}); // ignoreHTTPSErrors may also be a good option
    } catch (e) {
      console.error(e);
      console.error(`${url}, Failed to get page
Retrying...`);
      try {
        await page.goto(url, true, {timeout: TIMEOUT_MS});
      } catch (e) {
        console.error(e);
      console.error(`${url}, Failed to get page
Returning failure page`);
        resolve({body: 'PUPPETEER HELPER FAILURE: page goto', url, index});
      }
    }
    page.evaluate(() => {
      return document.querySelector('body').innerHTML;
    }).then(body => {
      resolve({body, url, index});
    })
    .catch(e => {
      console.warn(e);
      console.warn(`${url}, Failed to evaluate page
Returning failure page`);
      resolve({body: 'PUPPETEER HELPER FAILURE: page.evaluate', url, index});
    });
  });
}
