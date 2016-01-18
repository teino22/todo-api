var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'something to do',
	completed : false
}, {
	id: 2,
	description: 'go to market',
	completed : false
}];

app.get('/', function (req, res){
	res.send('Todo API Root');
});

app.get('/todos', function (req, res){
	res.send(todos);
});

app.get('/todos/:id', function (req, res){
	res.send(todos[id]);
});

app.listen(PORT, function() {
	console.log(' Express listening on port '+PORT+'!');
});