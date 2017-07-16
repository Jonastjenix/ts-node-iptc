import * as fs from "fs";
import * as assert from "assert";
import {IptcParser} from "../lib/IptcParser";

describe('node-iptc extraction', () => {
  it('should extract IPTC metadata from the image', (done) => {
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

  it('should extract IPTC metadata from the image', (done) => {
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

  it('should extract IPTC metadata from the image', (done) => {
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

  it('should extract IPTC metadata from the image', (done) => {
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


