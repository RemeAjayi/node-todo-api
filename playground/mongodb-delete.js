//const MongoClient= require('mongodb').MongoClient;
const {MongoClient, ObjectID}= require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=> {
const db = client.db('TodoApp');
if(err)
{
   return console.log('Unable to connect to MongoDB');
}
console.log('Connected to MongoDB Server');
//deleteMany
/*db.collection('Todos').deleteMany({text: "eat lunch"}).then((result) =>
{
    console.log(result);
});*/
//deleteOne, deletes the first item that matches the condition and stops
//findOne and delete, incase you want to undo delete
db.collection('Users').findOneAndDelete({
    _id: new ObjectID("5b116f48074ade1f6459627c")
}).then((results)=> {
    console.log(JSON.stringify(results,undefined,2));
});
//capitalization of object ID must be same as that in line 1
//gets the object back with value property
//db.close
});
