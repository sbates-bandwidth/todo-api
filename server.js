var _ = require('underscore');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
}, {
    id: 2,
    description: 'Go to market',
    completed: false
}, {
    id: 3,
    description: 'Go to school',
    completed: true
}];

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

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
})