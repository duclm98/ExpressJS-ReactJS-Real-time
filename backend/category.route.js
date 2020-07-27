const express = require('express');
const low = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');
const moment = require('moment');

const adapter = new fileSync('./db.json');
const db = low(adapter);

const router = express.Router();

router.get('/', function (req, res) {
  const ts = +req.query.ts || 0;
  const categories = db.get('categories').filter(c => c.iat > ts);
  res.json({
    return_ts: moment().unix(),
    categories
  });
});

router.get('/lp', function (req, res) {
  const ts = +req.query.ts || 0;

  let loop = 0;
  const fn = _ => {
    const categories = db.get('categories').filter(c => c.iat > ts);
    const return_ts = moment().unix();

    if (categories.size() > 0) {
      res.json({
        return_ts, categories
      });
    } else {
      loop++;
      console.log(`loop: ${loop}`);
      if (loop < 4) {
        setTimeout(fn, 2500);
      } else {
        res.status(204).send('NO DATA.');
      }
    }
  }

  fn();
});

const { broadcastAll } = require('./ws');
const { publishCategoryAdded } = require('./sse');

router.post('/', function (req, res) {
  var c = {
    name: req.body.name,
    iat: moment().unix()
  }

  db.get('categories').push(c).write();
  res.status(201).json(c);

  // ws
  const msg = JSON.stringify(c);
  broadcastAll(msg);

  // sse
  publishCategoryAdded(c);
})

module.exports = router;