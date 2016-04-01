var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', (req, res, next) => {
	res.render('login',{title:'用户登入'});
});

router.post('/', (req, res) => {
	var md5 = require('crypto').createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	User.get(req.body.username, (err, user) => {
		if(!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/login');
		}
		if(user.password != password) {
			req.flash('error', '用户口令错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登入成功');
		console.log('success');
		res.redirect('/');
	});
});



module.exports = router;