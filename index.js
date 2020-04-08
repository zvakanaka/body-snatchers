const fetch = require('node-fetch');
const sequential = require('sequential-promise-all');
const puppeteer = require('puppeteer');
const puppeteerHelper = require('./lib/puppeteerHelper');

module.exports = {
  getBodies,
  getBody,
};

/**
 * Get multiple page bodies in serial.
 * @param {Object[]} arr Array of objects containing URLs and (optional - defaults false) JS flags (e.g. [{url, js}])
 * @returns {String[]} Array of body strings
 */
async function getBodies(arr) {
  let nonJsRequests = [];
  let jsRequests = [];
  arr.forEach((item, i) => {
    if (item.js || item.javascript) {
      jsRequests.push({ url: item.url, index: i });
    } else {
      nonJsRequests.push(_getBody(item.url, i));
    }
  });
  const nonJsArr = await Promise.all(nonJsRequests);
  const jsArr = jsRequests.length > 0 ? await _getBodiesJavaScript(jsRequests) : [];
  const unsortedArr = [...jsArr, ...nonJsArr];
  // sort by original index
  const sortedArr = unsortedArr.sort((a, b) => a.index - b.index);
  return sortedArr.map(responseObj => responseObj.body);
}

/**
 * Get a single page.
 * @param {String} url URL of page
 * @param {Boolean} js Does page require JavaScript?
 * @return {String} Body string
 */
async function getBody(url, js) {
  const pageBodies = await getBodies([{url, js}]);
  if (Array.isArray(pageBodies) && pageBodies.length === 1) {
    return pageBodies[0];
  } else {
    console.error(`Failed to get page body`);
  }
}

/**
 * Open pages in puppeteer serially, and return an array of objects containing
 * page bodies (after evaluating the JavaScript on each page).
 * @param {Object[]} options Array of objects with URL and index (e.g. [{url, index}])
 * @return {Object[]} Array of objects with body, URL, and index (e.g. [{body, url, index}])
 */
async function _getBodiesJavaScript(options) {
  const notHeadless = process.env.FORCE_NOT_HEADLESS ? process.env.FORCE_NOT_HEADLESS === 'true' : false;
  const launchOptions = {
    headless: !notHeadless
  };
  if (process.env.CHROME_PATH) {
    launchOptions.executablePath = process.env.CHROME_PATH; // e.g. '/usr/bin/chromium-browser'
  }
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  const responseObjects = await sequential(
    puppeteerHelper,
    [{page, url: options[0].url, index: options[0].index}],
    options.length,
    (argsHandle,
     _previousResponse,
     i) => {
       argsHandle[0] = {page, url: options[i].url, index: options[i].index};
     });
  await browser.close();
  return responseObjects;
}

/**
 * Get the page using a simple HTTP request.
 * @param {String} url
 * @param {Number} index
 * @returns {Object} Object with body, URL, and index (e.g. {body, url, index})
 */
async function _getBody(url, index) {
  // TODO: set fetch headers, or allow setting them from parameter
  try {
    const res = await fetch(url, {});
    const body = await res.text();

    return {body, url, index};
  } catch (e) {
    console.error(e);
    console.error(`FETCH FAILURE: could not fetch page ${index}, ${JSON.stringify(url)}`)
    return {body: 'FETCH FAILURE: could not fetch page', url, index};
  }
}
