const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=> {
const db = client.db('TodoApp');
if(err)
{
   return console.log('Unable to connect to MongoDB');
}
console.log('Connected to MongoDB Server');

db.collection('Todos').insertOne({
    text: 'Download dependable God',
    completed: false
}, 
(err, result)=> {
    if(err) {
        return console.log('Unable to insert todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
}); 

db.collection('Users').insertOne({
    name: 'Olohireme Ajayi',
    age: 20,
    location: 'Benin City'
}, 
(err, result)=> {
    if(err) {
        return console.log('Unable to create User', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
});

client.close();
});
