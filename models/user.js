var mongodb = require('./db');

// 存入Mongodb文档
var _user = {};

function User(user) {
	this.name = user.name;
	this.password = user.password;
	_user.name = user.name;
	_user.password = user.password;
};
module.exports = User;

User.prototype.save = (callback) => {
	mongodb.open((err, db) => {
		if(err) {
			return callback(err);
		}

		var user = {
			name: this.name,
			password: this.password
		}

		// 读 users 集合
		db.collection('users', (err,collection) => {
			 if(err) {
				mongodb.close();
				return callback(err);
			}
			// 为 name 属性添加索引
			collection.ensureIndex('name');
			// 写入 user 文档
			console.log('_user:');
			console.log(_user);
			collection.insert(_user, {safe: true}, (err, user) => {
				mongodb.close();
				callback(err, user);
			});
		});
	});
};

User.get = function(username, callback) {
	mongodb.open( (err, db) => {
		if(err) {
			mongodb.close();
			return callback(err);
		}

		db.collection('users', (err, collection) => {
			if(err) {
				console.error(err);
				mongodb.close();
				return callback(err);
			}
			collection.findOne({name: username}, (err, doc) => {
				mongodb.close();
				if(doc) {
					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};