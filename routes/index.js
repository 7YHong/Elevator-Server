var express = require('express');
var router = express.Router();
//var io=require('socket.io');
jsoncnt=0;

/* GET home page. */
router.get('/', function(req, res, next) {
    // req.set('tmp',"this is a message seted in express");
  res.render('index', { title: 'Express' });
});

router.get('/cicle',function (req, res) {
    res.render('cicle');
})

router.get('/autofresh',function (req, res,next) {
    res.render('autofresh',{title:"autofresh"});
});

router.get('/send',function (req, res) {
    io.sockets.emit('news','jsoncnt updated: '+jsoncnt);
    res.send('your message '+jsoncnt++ +' has been sent to all websocket clients');
});

router.get('/json',function (req, res) {
    var jsonresult={name:"name",jsoncnt:jsoncnt};
    jsoncnt++;
    // res.send(jsonresult);
    res.send(JSON.stringify(jsonresult));
    // res.send(req.get('tmp'));
});
module.exports = router;
