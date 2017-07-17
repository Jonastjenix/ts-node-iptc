import * as fs from "fs";
import * as assert from "assert";
import {IptcParser} from "../lib/IptcParser";

describe('ts-node-iptc extraction', () => {
  it('should extract IPTC metadata from image 2', (done) => {
    fs.readFile("./test/test2.jpeg", (err, data) => {
      if (err) {
        throw err
      }
      let extracted = IptcParser.parse(data);
      let expected = require('./test2.jpeg.json');

      assert.equal(JSON.stringify(extracted), JSON.stringify(expected));
      done();

    });
  });

  it('should extract IPTC metadata from image 3', (done) => {
    fs.readFile("./test/test3.jpeg", (err, data) => {
      if (err) {
        throw err
      }
      let extracted = IptcParser.parse(data);
      let expected = require('./test3.jpeg.json');

      assert.equal(JSON.stringify(extracted), JSON.stringify(expected));
      done();

    });
  });

  it('should extract IPTC metadata from image 1', (done) => {
    fs.readFile("./test/test1.jpeg", (err, data) => {
      if (err) {
        throw err
      }
      let extracted = IptcParser.parse(data);
      let expected = require('./test1.jpeg.json');

      assert.equal(JSON.stringify(extracted), JSON.stringify(expected));
      done();

    });
  });

  it('should extract IPTC metadata from image 4', (done) => {
    fs.readFile("./test/test4.jpeg", (err, data) => {
      if (err) {
        throw err
      }
      let extracted = IptcParser.parse(data);
      let expected = require('./test4.jpeg.json');
      assert.equal(JSON.stringify(extracted), JSON.stringify(expected));
      done();
    });
  });

  it('should correctly handle IPTC fields of length 2',  (done)=> {
    fs.readFile("./test/test5.jpeg",  (err, data)=> {
      if (err) {
        throw err
      }
      let extracted = IptcParser.parse(data);
      assert.equal(extracted["country_or_primary_location_code"], "US");
      assert.equal(extracted["province_or_state"], "CT");
      done();
    });
  });

  it('should NOT extract IPTC metadata from the image because it has none', (done) => {
    fs.readFile("./test/test_no_iptc.jpeg", (err, data) => {
      if (err) {
        throw err
      }
      let extracted = IptcParser.parse(data);

      assert.equal(Object.keys(extracted).length, 0, 'There should be no data');
      done();
    });
  })

});


