var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

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

}); //end of post call to /todos

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
  res.status(400).send(e);
  });
});//end of get call to /todos

app.get('/todos/:id', (req, res) =>
{
  var id = req.params.id;
  if(!ObjectID.isValid(id))
{
   return res.status(404).send();
}  

Todo.findById({
  _id: id
}).then((todos) => {
  if(!todos)
  {
      return res.status(404).send();
  }
  res.send({todo});
}).catch((e) => 
res.status(400).send());


});//return a particular id

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

app.listen(3000, ()=> {
  console.log("Starting up on port 3000");
});

module.exports = {app};

//what is a REST API?
//diff b/w app.post and app.get
//tested /todos in postman