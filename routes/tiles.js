var express = require('express');
var router = express.Router();
var tilelive = require('tilelive');
require('mbtiles').registerProtocols(tilelive);
var rasterTileSource;
router.all('*', function (req, res, next) {
  // 支持跨域
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  // res.header("X-Powered-By",' 3.2.1');
  next();
});
router.get('/', function (req, res) {
  res.send('hey ...')
})

router.get(/^\/tiles\/(\d+)\/(\d+)\/(\d+).png$/, function (req, res, next) {
  loadRasterSource((source) => {
    var z = req.params[0];
    var x = req.params[1];
    var y = req.params[2];
    console.log('get tile %d, %d, %d', z, x, y);

    source.getTile(z, x, y, function (err, tile, headers) {
      console.log(tile, headers);
      if (err) {
        res.status(404)
        res.send(err.message);
        console.log(err.message);
      } else {
        res.set(headers);
        res.send(tile);
      }
    });
  })

});
function loadRasterSource(callback) {
  if (rasterTileSource) {
    callback(rasterTileSource);
  } else {
    tilelive.load('mbtiles:./data/test.mbtiles', function (err, source) {
      console.log(err, source, '--------------');
      if (err) {
        throw err;
      }
      rasterTileSource = source;
      callback(rasterTileSource)
    });
  }
}

module.exports = router;