var _ = require('underscore');
var db = require('./db.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
    var query = req.query;
    var where = {}

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.completed && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        }
    }

    db.todo.findAll({where: where}).then(function(todos) {
        if (todos) {
            res.json(todos);
        } else {
            res.status(404).send();
        }
    }, function(error) {
        res.status(500).send();
    });
});

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);

    db.todo.findById(todoId).then(function(todo) {
        if (todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(error) {
        res.status(500).send();
    });
});

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(error) {
        res.status(400).json(error);
    });
});

app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var result = _.findWhere(todos, {
        id: todoId
    });

    if (!result) {
        res.status(404).json({
            "error": "no todo found with that id"
        });
    } else {
        todos = _.without(todos, result);
        res.json(result);
    }
});

app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);

    res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});