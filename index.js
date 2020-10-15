const Secrets = require('./Secrets.json');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
var snoowrap = require('snoowrap');
const http = require('https');
const fs = require('fs');
const r = new snoowrap({
    userAgent: Secrets.UA,
    clientId: Secrets.CID,
    clientSecret: Secrets.CS,
    refreshToken: Secrets.RT
  });
async function getMemes() {
  let x = await r.getSubreddit('memes').getTop({time: "day"});
  for (let y = 0; y < x.length; y++) {
    db.get('posts').push({id: y, url: x[y].url}).write();
  };
};
async function clearDB() {
  for (let index = 0; index < 25; index++) {
    db.get('posts').remove({id: index}).write();
  }
};
async function downloadMemes(){
  for (let y = 0; y < 25; y++) {
    let z = await db.get('posts').find({id: y}).value();
    if (z.url.includes("redd.it")) {
      const file = fs.createWriteStream(`../blusec.uk/memes/${y}.${z.url.substring(32)}`);
      const request = http.get(z.url, function(response) {
        response.pipe(file);
        console.log(`created ${y}`);
      });
    } else if (z.url.includes('imgur')) {
      const url = `https://i.imgur.com/${z.url.substring(18)}.png`
      const file = fs.createWriteStream(`../blusec.uk/memes/${y}.png`);
      const request = http.get(url, function(response) {
        response.pipe(file);
        console.log(`created ${y}`);
      });
    }
  }
}
async function clearMemes() {
  for (let y = 0; y < 25; y++) {
    let z = await db.get('posts').find({id: y}).value();
    if (z.url.includes("redd.it")) {
      fs.unlink(`../blusec.uk/memes/${y}.${z.url.substring(32)}`, () => {
        console.log(`deleted ${y}`);
      });
    } else if (z.url.includes('imgur')) {
      const url = `https://i.imgur.com/${z.url.substring(18)}.png`
      fs.unlink(`../blusec.uk/memes/${y}.png`, () => {
        console.log(`deleted ${y}`);
      });
    }
  }
}
async function run() {
   await console.log("=============================================");
   await clearMemes();
   await clearDB();
   await getMemes();
   await downloadMemes();
   setTimeout(run, 86400000);
};

// run();
console.log("This script needs editing before using");
process.exit(1);