const chai = require('chai');
const should = chai.should();

const bodySnatchers = require('../index');
const BASE_URL = 'http://localhost:7777';
const TEST_PAGE_1 = 'site-list.html';
const TEST_PAGE_2 = 'site-list-single.html';
const TEST_PAGE_3 = 'site-list-none.html';
const TEST_PAGE_4 = 'site-list-several-js.html';

describe('body-snatcher', function() {
  it('should handle multiple JavaScript URLs', async () => {
    const urls = [
      `${BASE_URL}/${TEST_PAGE_2}`,
      `${BASE_URL}/${TEST_PAGE_1}`,
      `${BASE_URL}/${TEST_PAGE_4}`
    ];
    const options = urls.map((url, i) => ({url, i, javascript: true}));
    const bodies = await bodySnatchers.getBodies(options);
    Number(bodies.length).should.equal(urls.length);
    (typeof bodies[0]).should.equal('string');
    (typeof bodies[1]).should.equal('string');
    (typeof bodies[2]).should.equal('string');
  });

  it('should handle multiple non-JavaScript URLs', async () => {
    const options = [
      {url: `${BASE_URL}/${TEST_PAGE_2}`, javascript: false},
      {url: `${BASE_URL}/${TEST_PAGE_1}`, javascript: false}
    ];
    const bodies = await bodySnatchers.getBodies(options);
    Number(bodies.length).should.equal(2);
    (typeof bodies[0]).should.equal('string');
    (typeof bodies[1]).should.equal('string');
  });

  it('should handle multiple non-JavaScript and JavaScript URLs', async () => {
    const options = [
      {url: `${BASE_URL}/${TEST_PAGE_2}`, javascript: false},
      {url: `${BASE_URL}/${TEST_PAGE_1}`, javascript: false},
      {url: `${BASE_URL}/${TEST_PAGE_1}`, javascript: true}
    ];
    const bodies = await bodySnatchers.getBodies(options);
    Number(bodies.length).should.equal(3);
    (typeof bodies[0]).should.equal('string');
    (typeof bodies[1]).should.equal('string');
    (typeof bodies[2]).should.equal('string');
  });

  it('should handle single non-JavaScript URL', async () => {
    const body = await bodySnatchers.getBody(`${BASE_URL}/${TEST_PAGE_1}`, false);
    (typeof body).should.equal('string');
  });

  it('should handle single JavaScript URL', async () => {
    const body = await bodySnatchers.getBody(`${BASE_URL}/${TEST_PAGE_1}`, true);
    (typeof body).should.equal('string');
  });
});
