require('./config/config');
const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var {authenticate} = require('./middleware/authenticate');
const hbs = require('hbs');
var session = require('express-session');
var app = express();

const port = process.env.PORT || 3000

//sets view
app.set('view engine', 'hbs');
app.use(express.static( './public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*The urlencoded method within body-parser tells body-parser to extract data from the
<form> element and add them to the body property in the request object*/
hbs.registerPartials('./views/partials')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


app.get('/', (req, res) =>
{
  res.render('login.hbs');
});

app.get('/register', (req, res) =>
{
  res.render('register.hbs');
});

app.post('/todos', authenticate, (req, res)=> {
//create a new instance of todo
    var todo = new Todo({
   text: req.body.text, 
   _creator: req.user._id
}); //req.body contains the data that the user sends with the request

todo.save().then( (doc)=> {
 res.send(doc);
}, (e) => {
res.status(400).send(e);
});

res.redirect('/todos');

}); //end of post call to /todos

app.get('/todos', authenticate, (req,res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
   //res.send({todos});
  res.render('todo.hbs', {todos});
  }, (e) => {
  res.status(400).send(e);
  });
});//end of get call to /todos

app.get('/todos/:id', authenticate, (req, res) => {
  
  var id = req.params.id;
 
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id, 
    _creator: req.user._id
  }).then((todo) => {
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
 
app.post('/delete/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todo) => {
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
 
app.post('/update/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _id:id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
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

// POST /users

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
   // res.header('x-auth', token).send(user);
   req.session.accessToken = token;
   //console.log(req.session.accessToken);
   res.redirect('/todos');
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);

});
//instance methods begin with u and model methods with U

//post /users/login
app.post('/users/login', (req, res) =>
{
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token) => {
        //res.header('x-auth', token);
        req.session.accessToken = token;
        //console.log(req.session.accessToken);
        res.redirect('/todos');
    });
  }).catch((e)=> {
        res.status(404).send();
  });
 
});
//logout 
//supply an x-auth token in the header
//x-auth should be the only header
app.get('/users/me/token', authenticate, (req,res)=> {
  res.render('logout.hbs');
  });
  
app.post('/users/me/token', authenticate, (req,res)=> {
req.user.removeToken(req.token).then(()=> {
res.status(200).send();
req.session.destroy();
res.redirect('/');
}, ()=>{
  res.status(400).send();
});
});

app.listen(port, ()=> {
  console.log(`Starting up on ${port}`);
});

module.exports = {app};

//what is a REST API?

//frontend frameworks will allow you make your app single page
//note that your content-type header must be set
//for this project it is application/json