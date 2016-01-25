var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

//One to many association
Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	// force: true
}).then(function() {
	console.log('Everything is synced');

	User.findById(1).then(function (user) {

		user.getTodos({
			where: {
				completed: true
			}
		}).then(function (todos){// return all todos for an user
			todos.forEach(function (todo){
				console.log(todo.toJSON());
			});
		});
	});

	// User.create({
	// 	email: 'email_value'
	// }).then(function (){
	// 	return Todo.create({
	// 		description: 'clean yard'
	// 	});
	// }).then(function (todo) {
	// 	User.findById(1).then(function (user){
	// 		user.addTodo(todo); // add create the association between a todo and a user
	// 	});
	// });
	// Todo.findById(1).then(function(todo) {
	// 	if (todo) {
	// 		console.log(todo.toJSON());
	// 	} else {
	// 		console.log('No todo found');
	// 	}
	// });
});