var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');

router.get('/:user', (req, res) => {
	User.get(req.params.user, (err, user) => {
		if(!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.get(user.name, (err, posts) => {
			if(err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			console.log(posts);
			res.render('user',{posts:posts});
		});
	});
});

module.exports = router;