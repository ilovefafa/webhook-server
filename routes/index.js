var express = require('express');
var router = express.Router();
var shell = require('shelljs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

function createHook(repo, appName) {
  if (!appName) appName = repo
  router.post(`/payload/${repo}`, function (req, res, next) {
    shell.cd(`/usr/website/${repo}`)
    let pull = shell.exec('git pull')
    let install = shell.exec('npm install')
    let restart = ''
    //webhook-server需等待响应发出后再重启
    if (repo === 'webhook-server') {
      res.on('finish', () => {
        restart = shell.exec(`pm2 restart ${appName}`)
      })
    } else {
      restart = shell.exec(`pm2 restart ${appName}`)
    }
    let commandResults = {
      pull,
      install,
      restart,
    }
    let isError = Object.keys(commandResults).some((item) => {
      return commandResults[item].code !== 0
    })
    if (isError) {
      res.status(500).json({
        message: 'error'
      })
    } else {
      res.json({
        message: 'done'
      })
    }
  });
}
// example:http://47.106.168.180:4000/payload/yineng-website-back-end

createHook('yineng-website-back-end', 'yineng-website')
createHook('webhook-server')

// router.post('/payload/yineng-website-back-end', function (req, res, next) {
//   shell.cd('/usr/website/yineng-website-back-end')
//   let pull = shell.exec('git pull')
//   let install = shell.exec('npm install')
//   let restart = shell.exec('pm2 restart yineng-website')
//   let commandResults = {
//     pull,
//     install,
//     restart,
//   }
//   let isError = Object.keys(commandResults).some((item) => {
//     return commandResults[item].code !== 0
//   })
//   if (isError) {
//     res.json({
//       message: 'error'
//     })
//   } else {
//     res.json({
//       message: 'done'
//     })
//   }
// });

module.exports = router;
