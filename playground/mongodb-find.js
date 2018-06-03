const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=> {
const db = client.db('TodoApp');
if(err)
{
   return console.log('Unable to connect to MongoDB');
}
console.log('Connected to MongoDB Server');

db.collection('Users').find({name: 'Isehise Ajayi'}).toArray().then((docs) =>{
    console.log(JSON.stringify(docs, undefined, 2));
  
},(err) => {
    console.log('unable to fetch data', err);

});
db.collection('Users').find({name: 'Olohireme Ajayi'}).count().then((count) =>{
    console.log(`Users = Ise: ${count}`);
  
},(err) => {
    console.log('unable to fetch data', err);

});
//client.close();
//field -> document -> collection
});
