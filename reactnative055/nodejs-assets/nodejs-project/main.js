var path = require('path');
var rn_bridge = require('rn-bridge');
var leveldown = require('leveldown');

function checkForErrors(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}

rn_bridge.channel.on('message', msg => {
  var appDataDir = rn_bridge.app.datadir();
  var db = leveldown(path.join(appDataDir, 'db'));
  db.open(err1 => {
    checkForErrors(err1);
    db.get('counter', {asBuffer: false}, (err2, val) => {
      var nextVal = !val ? '10' : String(Number(val) + 1);
      db.put('counter', nextVal, err3 => {
        checkForErrors(err3);
        db.close(err4 => {
          checkForErrors(err4);
          rn_bridge.channel.send(nextVal);
        });
      });
    });
  });
});
