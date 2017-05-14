var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/ele');
router.use(function (req, res, next) {
    req.db = db;
    next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('user');
    collection.find({},{},function (e, docs) {
        res.render('userlist', {
            "userlist": docs,"title":"userlist",'jsoncnt':jsoncnt++
        });
    });
});

module.exports = router;
