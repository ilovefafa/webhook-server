var express = require('express');
var router = express.Router();
var shell = require('shelljs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/payload/yineng-website-back-end', function (req, res, next) {
  let respone = req.body
  if (respone.commits.length > 0) {
    shell.cd('/usr/website/yineng-website-back-end')
    // console.log(shell.exec('git pull'))
    // console.log(shell.exec('git install'))
    // console.log(shell.exec('pm2 restart yineng-website'))
    let pull = shell.exec('git pull')
    let install = shell.exec('git install')
    let restart = shell.exec('pm2 restart yineng-website')
  }
  res.json({
    pull,
    install,
    restart
  });
});

module.exports = router;
