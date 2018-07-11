const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const hbs = require('hbs');
var app = express();

const port = process.env.PORT || 3000

//sets view
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*The urlencoded method within body-parser tells body-parser to extract data from the
<form> element and add them to the body property in the request object*/


app.post('/todos', (req, res)=> {
//create a new instance of todo
    var todo = new Todo({
   text: req.body.text
}); //req.body contains the data that the user sends with the request

todo.save().then( (doc)=> {
 res.send(doc);
}, (e) => {
res.status(400).send(e);
});

res.redirect('/todos');

}); //end of post call to /todos

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
   // res.send({todos});
   res.render('todo.hbs', {todos});
  }, (e) => {
  res.status(400).send(e);
  });
});//end of get call to /todos

app.get('/todos/:id', (req, res) => {
  
  var id = req.params.id;
 
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(500).send();
    }
    res.render('view_single_todo.hbs', {todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/delete/todos', (req, res)=> {
  Todo.remove({}).then((result)=> {
  });
  res.redirect('/todos');
 });

app.get('/delete/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
res.render('delete_todo.hbs');

});
 
app.post('/delete/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
   res.redirect('/todos');
  }).catch((e) => {
    res.status(400).send();
  });

});
app.get('/update/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(500).send();
    }
    res.render('update_todo.hbs', {todo});
  }).catch((e) => {
    res.status(400).send();
  });
});
 
app.post('/update/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

if(_.isBoolean(body.completed) && body.completed)
{
 body.completedAt = new Date().getTime();
}
else{
  body.completed = false;
  body.completedAt = null;
}

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
   res.render('view_single_todo.hbs',  {todo});
  }).catch((e) => {
    res.status(400).send();
  });

});
//to access post you need to use a form with action of post

//update route
//remove checkboxes from main todo page
//when updated to be complete, each todo should be ticked and have strikethrough
//all deletion is manual
//update readme

app.post('/users', (req, res)=> {
  //create a new user
      var user = new User({
     email: req.body.emai
  }); //req.body contains the data that the user sends with the request
  
  user.save().then( (doc)=> {
   res.send(doc);
  }, (e) => {
  res.status(400).send(e);
  });
  
  });

app.listen(port, ()=> {
  console.log(`Starting up on ${port}`);
});

module.exports = {app};

//what is a REST API?


