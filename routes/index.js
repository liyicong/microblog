var express = require('express');
var router = express.Router();
var Post = require('../models/post');


// 首页

router.get('/', (req, res) => {
	Post.get(null, (err, posts) => {
		if(err) {
			posts = [];
		}
		console.log(posts);
		res.render('index',{posts: posts});
	});
});


module.exports = router;
