const mongoose = require('mongoose');

// Using Global Promise for Mongoose
mongoose.Promise = global.Promise;
/*
mongoose.connect('mongodb://localhost:27017/videoIdea',{
    useNewUrlParser: true
})*/
mongoose.connect('mongodb://elraphty:Elraphty1@ds139949.mlab.com:39949/videoideas',{
    useNewUrlParser: true
})
 .then(() => { console.log("MongoDb connected") })
 .catch(err => console.log(err));

module.exports = mongoose;