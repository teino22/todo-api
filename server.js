var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('Todo API Root');
});

app.get('/todos', function (req, res){
	var queryParams = req.query;
	var filteredTodos = todos;
	
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed:true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false' ){
		filteredTodos = _.where(filteredTodos, {completed:false});
	}

	res.json(filteredTodos);
});

app.get('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos, {id:todoId});
	if (matchedTodo){
		res.json(matchedTodo);
	}
	else{
		res.status(404).send('No todo found with id: '+ todoId );
	}
});

app.post ('/todos', function (req, res) {
	var body = _.pick(req.body,'description','completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || _.isEmpty(body.description.trim())){
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.delete('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos, {id:todoId});
	if(!matchedTodo){
		res.status(404).json({"error":"no todo found with id = "+todoId});
	}
	else{
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);	
	}
	
});

app.put('/todos/:id', function (req, res){
	
	var body = _.pick(req.body,'description','completed');
	var validAttributes = {};
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos, {id:todoId});

	if(!matchedTodo){
		res.status(404).json({"error":"no todo found with id = "+todoId});
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')){
		return res.status(400).send('is not boolean');
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && !_.isEmpty(body.description.trim()) ){
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')){
		return res.status(400).send('description is malformed');
	}
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});



app.listen(PORT, function() {
	console.log('Express listening on port '+PORT+'!');
});