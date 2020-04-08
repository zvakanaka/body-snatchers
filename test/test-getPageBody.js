const chai = require('chai');
const should = chai.should();

const bodySnatcher = require('../index');
const BASE_URL = 'http://localhost:7777';
const TEST_PAGE_1 = 'site-list.html';
const TEST_PAGE_2 = 'site-list-single.html';
const TEST_PAGE_3 = 'site-list-none.html';
const TEST_PAGE_4 = 'site-list-several-js.html';

describe('body-snatcher', function() {
  it('should handle multiple JavaScript URLs', function(done) {
    const urls = [`${BASE_URL}/${TEST_PAGE_2}`, `${BASE_URL}/${TEST_PAGE_1}`, `${BASE_URL}/${TEST_PAGE_4}`];
    const options = urls.map((url, i) => ({url, i, javascript: true}));
    bodySnatcher.getPageBodies(options).then(bodies => {
      Number(bodies.length).should.equal(urls.length);
      done();
    }).catch(e => {
      console.error(e);
      (true).should.equal(false);
      done();
    });
  });

  it('should handle multiple non-JavaScript URLs', function(done) {
    const urls = [{url: `${BASE_URL}/${TEST_PAGE_2}`, javascript: false}, {url: `${BASE_URL}/${TEST_PAGE_1}`, javascript: false}];
    bodySnatcher.getPageBodies(urls).then(bodies => {
      Number(bodies.length).should.equal(2);
      done();
    }).catch(e => {
      console.error(e);
      (true).should.equal(false);
      done();
    });
  });

  it('should handle multiple non-JavaScript and JavaScript URLs', function(done) {
    const urls = [{url: `${BASE_URL}/${TEST_PAGE_2}`, javascript: false}, {url: `${BASE_URL}/${TEST_PAGE_1}`, javascript: false}, {url: `${BASE_URL}/${TEST_PAGE_1}`, javascript: true}];
    bodySnatcher.getPageBodies(urls).then(bodies => {
      Number(bodies.length).should.equal(3);
      done();
    }).catch(e => {
      console.error(e);
      (true).should.equal(false);
      done();
    });
  });

  it('should handle single non-JavaScript URL', function(done) {
    bodySnatcher.getPageBody(`${BASE_URL}/${TEST_PAGE_1}`, false).then(body => {
      (typeof body).should.equal('string');
      done();
    }).catch(e => {
      console.error(e);
      (true).should.equal(false);
      done();
    });
  });
});
