const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = "5b2581041591a91ae45b4d9311";

if(!ObjectID.isValid(id)){
    console.log('id not valid');
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// }); //.find returns an array, will return empty array if not found
// Todo.findOne({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });// returns null object if not found, more useful for 404
// Todo.findById({
//     _id: id
// }).then((todos) => {
//     if(!todos)
//     {
//         return console.log('Id not found');
//         //because if ID is valid and not found an error won't be thrown, it would return null
//     }
//     console.log('Todos', todos);
// }).catch((e) => console.log(e));



//read the mongoose docs