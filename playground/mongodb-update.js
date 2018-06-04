//const MongoClient= require('mongodb').MongoClient;
const {MongoClient, ObjectID}= require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=> {
const db = client.db('TodoApp');
if(err)
{
   return console.log('Unable to connect to MongoDB');
}
console.log('Connected to MongoDB Server');
//find one and update
//for example when admin clicks edit icon
db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5b116faf2aebb708c4ca25d7")
}, {
    $set: {
        completed: true
    }
},
{
returnOriginal: false
}
).then((results)=> {
    console.log(results);
});
db.collection('Users').findOneAndUpdate(
    {
    _id: new ObjectID("5b116faf2aebb708c4ca25d8")
},
 {
     $set:{
    name: "Aimiebilomon Ajayi"
},
    $inc: {
        age: 1
    }
},
{
returnOriginal: false
}
).then((results)=> {
    console.log(results);
});
//db.close
});
