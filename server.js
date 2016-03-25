var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
    return res.json(todos);
});

app.get('/todos/:id', function (req, res) {
    var result = _.find(todos, function (toCheck) {
        return toCheck.id.toString() === req.params.id
    });

    if (result) {
        res.json(result); 
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function (req, res) {
    var body = req.body;

    body.id = todoNextId++;

    todos.push(body);
    res.json(body);
});

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
})